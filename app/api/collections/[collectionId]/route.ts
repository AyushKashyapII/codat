import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{collectionId: string}>}) {
  try {
    const { collectionId } = await params;

    if (!collectionId) {
      return NextResponse.json(
        { error: "Collection Id is required" },
        { status: 403 }
      )
    }

    const codats = await db.collections.findUnique({
      where: {
        collectionId
      },
      select: {
        collectionName: true,
        collectionDesc: true,
        collectionColor:true,
        collectionCodats: {
          select: {
            codatName: true,
            codatId: true,
            codatDescription: true,
            codatLanguage: true,
            codatAuthor:true,
            codatCode:true,
            createdAt: true,
            updatedAt: true,
          }
        },
      }
    })

    console.log(codats,"codats")

    return NextResponse.json(codats, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}