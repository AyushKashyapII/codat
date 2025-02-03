import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiDesc } from '@/lib/codatAIDescription';
import { aiFunc } from '@/lib/codatAIFunction';
import { qdrantStore } from '@/lib/qdrantStore';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    const currentUser = await db.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            attachedAiSearcher: true,
        },
    });

    if (!currentUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const {code, language, title, description} = await req.json();
    if(!code || !language || !title) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (!currentUser || !session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const aiDescritpion = await aiDesc(code, language, session.user.name) || '';
    const aiFunction = await aiFunc(code, language, session.user.name) || '';
    
    const codat = await db.codat.create({
        data: {
        codatName: title,
        codatCode: code,
        codatLanguage: language,
        codatAuthor: {
            connect: {
            id: userId,
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
            attachedUserId: userId
        },
        select: {
            textToPassToAI: true
        }
    });

    const currentData = aiSearcherData?.textToPassToAI as Array<{ id: number; text: string }> || [];

    const aiSearcher = await db.aiSearcher.update({
        where: {
            attachedUserId: userId
        },

        data: {
            textToPassToAI: [
                ...currentData,
                {
                    id: codat.codatId,
                    text: aiDescritpion
                }
            ]
        },
    });
    if (!currentUser.name) {
        return NextResponse.json({ error: 'User name not found' }, { status: 400 });
    }
    const isStored = await qdrantStore(code, language, currentUser.name, Number(codat.codatId));
    console.log('Codat saved successfully:', codat);
    return NextResponse.json({ message: 'Codat saved successfully', codat });
}

