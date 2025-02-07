import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get("Authorization")?.replace("Bearer ", "");
        console.log(token);
        
        if (!token) {
            return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const codatId = searchParams.get("codatId");
        if (!codatId) {
            return NextResponse.json({ error: "Bad Request: Missing codatLink" }, { status: 400 });
        }
        console.log(codatId);
        
        const user = await db.profile.findUnique({
            where: { token },
            select: { id: true, name: true }
        });

        if (!user) {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }

        const codat = await db.codat.findFirst({
            where: {
                codatId: codatId,
                authorId: user.id,
            }
        });

        if (!codat) {
            return NextResponse.json({ error: "Forbidden: You are not the author of this Codat" }, { status: 403 });
        }

        return NextResponse.json({
            message: "Access granted",
            codat
        });

    } catch (error) {
        console.error("Error fetching Codat:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
