import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiDesc } from '@/lib/codatAIDescription';
import { aiFunc } from '@/lib/codatAIFunction';
import { qdrantStore } from '@/lib/qdrantStore';
import { currentProfile } from '@/lib/current-profile';

export async function POST(req: Request) {
    
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const userId = session.user.id;
    // const currentUser = await db.profile.findUnique({
    //     where: {
    //         id: userId,
    //     },
    //     select: {
    //         id: true,
    //         name: true,
    //         email: true,
    //         phoneNumber: true,
    //         attachedAiSearcher: true,
    //     },
    // });

    const currentUser = await currentProfile();

    if (!currentUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Log the raw request body for debugging
    const rawBody = await req.text();

    let requestBody;
    try {
        requestBody = JSON.parse(rawBody);
    } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        return NextResponse.json({ 
            error: 'Invalid JSON in request body',
            rawBody: rawBody 
        }, { status: 400 });
    }

    const { code, language, title, description } = requestBody;

    // Validate request body
    if (!code || !language || !title) {
        return NextResponse.json({ 
            error: 'Missing required fields',
            receivedBody: requestBody 
        }, { status: 400 });
    }

    if (!currentUser.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const aiDescritpion = await aiDesc(code, language, currentUser.name || " ") || '';
    const aiFunction = await aiFunc(code, language, currentUser.name || " ") || '';
    
    const codat = await db.codat.create({
        data: {
        codatName: title,
        codatCode: code,
        codatLanguage: language,
        codatAuthor: {
            connect: {
            id: currentUser.id,
            },
        },
        codatDescription: description,
        codatAIDesc: aiDescritpion,
        codatAIFunc: aiFunction,
        codatIsPublic: false,
        },
    });

    const aiSearcherData = await db.aiSearcher.findUnique({
        where: {
            attachedProfileId: currentUser.id
        },
        select: {
            textToPassToAI: true
        }
    });
    
    const currentData = aiSearcherData?.textToPassToAI 
    ? JSON.parse(JSON.stringify(aiSearcherData.textToPassToAI)) 
    : [];

    const aiSearcher = await db.aiSearcher.update({
        where: {
            attachedProfileId: currentUser.id
        },
        data: {
            textToPassToAI: JSON.stringify([
                ...currentData,
                {
                    id: codat.codatId,
                    text: aiDescritpion
                }
            ])
        },
    });

    if (!currentUser.name) {
        return NextResponse.json({ error: 'User name not found' }, { status: 400 });
    }
    const isStored = await qdrantStore(code, language, currentUser.name, Number(codat.codatId));
    console.log('Codat saved successfully:', codat);
    return NextResponse.json({ message: 'Codat saved successfully', codat });
}

