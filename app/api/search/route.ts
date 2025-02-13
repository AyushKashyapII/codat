/* eslint-disable */

import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from 'next/server';
import { aiSearch } from '@/lib/codatAISearcher';

export async function POST(req: Request){
try {
        const currentUser = await currentProfile();
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
    
        const usersAiSearcher = await db.aiSearcher.findUnique({
            where: {
                attachedProfileId: currentUser.id,
            },
        })
        const arr = usersAiSearcher?.textToPassToAI;
        let data = typeof arr === 'string' 
            ? JSON.parse(arr) 
            : arr;
    
        interface DataItem {
            id: string;
            text: string;
        }
        data = data as DataItem[];
    
        const text = data
            .map((item: DataItem) => `${item.id}\n${item.text}`)
            .join('\n\n');
    
        const body = await req.json();
        const { query } = body;
    
        const idOfCodat = await aiSearch(text, query) || "0";
    
        if(idOfCodat === "0"){
            return NextResponse.json({ error: 'No such piece of text found' }, { status: 404 });
        }
    
        const codat = await db.codat.findUnique({
            where: {
                codatId: idOfCodat,
            },
        });
        console.log("This is the codat i was able to find\n" + codat);
        return NextResponse.json(codat);
} catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}