import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{id: string}> }) {
  try {
  
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}