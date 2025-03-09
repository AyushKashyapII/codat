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
      return NextResponse.json({ error: "id not found"}, { status: 403 })
    }
    
    const team = await db.teams.findUnique({
      where: {
        teamId: id
      },
      select: {
        teamOwnerId: true,
        teamMembers: {
          select: {
            id: true,
          }
        }
      }
    })
    
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    
    if (team.teamOwnerId == profile.id || team.teamMembers.some(mem => mem.id === profile.id)) {
      return NextResponse.json({ error: "Already part of team" }, { status: 403 });
    }
    
    const updatedTeam = await db.teams.update({
      where: {
        teamId: id
      },
      data: {
        teamMembers: {
          connect: { id: profile.id }
        }
      }
    })
    
    if (!updatedTeam) {
      return NextResponse.json({ error: "Failed to join team" }, { status: 500 });
    }
    
    return NextResponse.json({ status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}


