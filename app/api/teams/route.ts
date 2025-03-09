import {currentProfile} from "@/lib/current-profile";
import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function GET() {
  try {
    const profile = await currentProfile();
    console.log(profile);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'User not logged in' },
        { status: 403 }
      )
    }
    
    const teams = await db.teams.findMany({
      where: {
        OR: [
          {
            teamMembers: {
              some: {
                id: profile.id
              }
            }
          },
          {
            teamModerators: {
              some: {
                id: profile.id
              }
            }
          },
          {
            teamOwnerId: profile.id
          }
        ]
      },
      select: {
        teamId: true,
        teamName: true,
        teamMembers: {
          select: {
            id: true
          }
        },
        teamModerators: {
          select: {
            id: true
          }
        },
        teamOwnerId: true,
      }
    })
    
    if (!teams) {
      return NextResponse.json({ error: "Can't find a team" }, { status: 404 });
    }
    
    const Teams = teams.map((team) => {
      let role = "member";
      
      if (team.teamOwnerId == profile.id) {
        role = "owner"
      } else if (team.teamModerators.some(mod => mod.id == profile.id)) {
        role = "moderator"
      }
      
      return { ...team, role };
    })
    
    return NextResponse.json(Teams, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    console.log(profile);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'User not logged in' },
        { status: 403 }
      )
    }
    
    const { teamName } = await req.json();
    
    if (!teamName) {
      return NextResponse.json({ error: "team name is required" }, { status: 403 });
    }
    
    const team = await db.teams.create({
      data: {
        teamName,
        teamOwnerId: profile.id
      }
    })
    
    if (!team) {
      return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
    }
    
    return NextResponse.json(team.teamId, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}