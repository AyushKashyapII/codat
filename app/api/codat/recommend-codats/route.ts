import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { tags } = body;

        if (!tags || !Array.isArray(tags)) {
            return NextResponse.json({ error: "Invalid tags" }, { status: 400 });
        }

        const recommendedCodats = await db.codat.findMany({
            where: {
                codatTags: { hasSome: tags },
                codatIsPublic: true,
            },
            orderBy: { codatLikes: "desc" },
        });

        if (recommendedCodats.length === 0) {
            const fallbackCodats = await db.codat.findMany({
                where: { codatIsPublic: true },
                orderBy: { codatLikes: "desc" },
                take: 5,
            });
        
            return NextResponse.json(fallbackCodats, { status: 200 });
        }
        return NextResponse.json(recommendedCodats, { status: 200 });

    } catch (error) {
        console.error("Error fetching recommended codats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
