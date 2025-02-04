import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiDesc } from '@/lib/codatAIDescription';
import { aiFunc } from '@/lib/codatAIFunction';
import { qdrantStore } from '@/lib/qdrantStore';
import { currentProfile } from '@/lib/current-profile';

export async function GET(req: Request, { params }: { params: { codatId: string[] } }) {
    try {
        const currentUser = await currentProfile();

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const codatId = params.codatId[0];

        if(!codatId){
            return NextResponse.json({ error: 'Codat id not found' }, { status: 403 });
        }

        const codat = await db.codat.findUnique({
            where: {
                codatId
            },
            select: {
                codatLanguage: true,
                codatDescription: true,
                codatName: true,
                codatCode: true,
            }
        })

        if (!codat) {
            return NextResponse.json({error: "codat not found"}, {status: 404});
        }

        return NextResponse.json(codat, {status: 200});
    } catch (e) {
        return NextResponse.json(
          { error: `Internal Server error: ${e}` },
          { status: 500 }
        );
    }
}


export async function PATCH(req: Request, { params }: { params: { codatId: string[] } }) {
    try {
        const currentUser = await currentProfile();

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { code, language, description, title } = await req.json();
        const codatId = params.codatId[0];

        if (!currentUser.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if(!codatId){
            return NextResponse.json({ error: 'Codat not found' }, { status: 404 });
        }

        if (language){
            await db.codat.update({
                where: { codatId: codatId },
                data: { codatLanguage: language },
            });
        }

        if (code){
            const aiDescritpion = await aiDesc(code, language, currentUser.name || " ") || '';
            const aiFunction = await aiFunc(code, language, currentUser.name || '') || '';

            const codat = await db.codat.update({
                where: { codatId: codatId },
                data: { codatCode: code, codatAIDesc: aiDescritpion, codatAIFunc: aiFunction },
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

            await db.aiSearcher.update({
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
        }

        if (description){
            await db.codat.update({
                where: { codatId: codatId },
                data: { codatDescription: description },
            });
        }
        if (title){
            await db.codat.update({
                where: { codatId: codatId },
                data: { codatName: title },
            });
        }
        const codat = await db.codat.findUnique({
            where: { codatId: codatId },
        });
        const aiSearcher = await db.aiSearcher.findUnique({
            where: {
                attachedProfileId: currentUser.id
            },
            select: {
                textToPassToAI: true
            }
        });
        console.log('Codat updated successfully:', codat);
        console.log('AI Searcher updated successfully:', aiSearcher);
        return NextResponse.json(codat, {status: 200});
    } catch (e) {
        return NextResponse.json(
          { error: `Internal Server error: ${e}` },
          { status: 500 }
        );
    }
}