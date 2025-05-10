/* eslint-disable */

import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from 'next/server';
import { aiSearch } from '@/lib/codatAISearcher';

export async function POST(req: Request) {
    try {
        console.log("Fetching current user profile...");
        const currentUser = await currentProfile();
        if (!currentUser) {
            console.log("User not found");
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
    
        console.log("Fetching user's AI searcher...");
        const usersAiSearcher = await db.aiSearcher.findUnique({
            where: {
                attachedProfileId: currentUser.id,
            },
        });
        const arr = usersAiSearcher?.textToPassToAI;
        let data = typeof arr === 'string'  
            ? JSON.parse(arr) 
            : arr;
    
        interface DataItem {
            id: string;
            text: string;
        }
        data = data as DataItem[];
    
        console.log("Formatting data...");
        const text = data
            .map((item: DataItem) => `${item.id}\n${item.text}`)
            .join('\n\n');
    
        console.log("Parsing request body...");
        const body = await req.json();
        const { query } = body;
    
        console.log("Performing AI search...");
        const idOfCodat = await aiSearch(text, query) || "0";
    
        if (idOfCodat === "0") {
            console.log("No such piece of text found");
            return NextResponse.json({ error: 'No such piece of text found' }, { status: 404 });
        }
        console.log("This is the id of the codat I was able to find\n" + idOfCodat);
    
        console.log("Fetching codat...");
        const codat = await db.codat.findUnique({
            where: {
                codatId: idOfCodat,
            },
        });
        console.log("This is the codat I was able to find\n" + codat?.codatId);
        return NextResponse.json(codat);
    } catch (error) {
        console.log("Internal Server Error", error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}