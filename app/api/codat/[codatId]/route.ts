import {NextRequest, NextResponse} from "next/server";
import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{codatId: string}>}) {
  try {
    const profile = await currentProfile();
    console.log(profile);

    if (!profile) {
      return NextResponse.json(
        { error: 'User not logged in' },
        { status: 403 }
      )
    }

    const { codatId } = await params;

    if (!codatId) {
      return NextResponse.json(
        {error: "codat id is required"},
        {status: 403}
      )
    }

    const codat = await db.codat.findUnique({
      where: {
        codatId
      }
    })

    if (!codat) {
      return NextResponse.json(
        {error: "codat not found"},
        { status: 404 }
      )
    }

    return NextResponse.json(codat, {status: 200})
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}