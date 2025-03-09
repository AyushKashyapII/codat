import {NextRequest, NextResponse} from "next/server";
import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{id: string}>}) {
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
    
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 403 });
    }
    
    const team = await db.teams.findUnique({
      where: {
        teamId: id
      },
      select: {
        teamMembers: {
          select: {
            id: true
          }
        }
      }
    });
    
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    
    if (!team.teamMembers.some(mem => mem.id === profile.id)) {
      return NextResponse.json({ error: "Not a member of team" });
    }
    
    const updatedTeam = await db.teams.update({
      where: {
        teamId: id
      },
      data: {
        teamMembers: {
          disconnect: { id: profile.id }
        },
        teamModerators: {
          disconnect: { id: profile.id }
        }
      }
    })
    
    if (!updatedTeam) {
      return NextResponse.json({ error: "Failed to leave team" }, { status: 500 });
    }
    
    return NextResponse.json({ status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}