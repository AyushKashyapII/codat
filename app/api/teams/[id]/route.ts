import {NextRequest, NextResponse} from "next/server";
import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{id: string}> }) {
  try {
    const profile = await currentProfile();
    console.log(profile);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'User not logged in' },
        { status: 403 }
      )
    }
    
    const { id } = await params;
    
    const team = await db.teams.findUnique({
      where: {
        teamId: id
      },
      select: {
        teamId: true,
        teamName: true,
        teamOwner: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        teamModerators: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        teamMembers: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        
      }
    })
    
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}

