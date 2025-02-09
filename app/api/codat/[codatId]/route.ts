import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }:  { params: Promise<{codatId: string}>}) {
  try {
    const { codatId } = await params;

    if (!codatId) {
      return NextResponse.json(
        { error: "Codat ID is required" },
        { status: 403 }
      );
    }

    const codat = await db.codat.findUnique({
      where: { codatId },
      include: {
        codatAuthor: {
          select: {
            id: true,
            name: true,
            image: true,
            email:true
          },
        },
      },
    });

    if (!codat) {
      return NextResponse.json(
        { error: "Codat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(codat, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}
