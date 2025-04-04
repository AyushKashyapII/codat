import {currentProfile} from "@/lib/current-profile";
import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function PATCH(request: NextRequest) {
  try {
    const profile = await currentProfile();
    console.log(profile);

    if (!profile) {
      return NextResponse.json(
        { error: 'User not logged in' },
        { status: 403 }
      )
    }

    const body = await request.json();

    const team = await db.teams.findUnique({
      where: {
        teamId: body.teamId
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

    if (!team) {
      return NextResponse.json({ error: "Can't find a team" }, { status: 404 });
    }

    if (team.teamOwnerId !== profile.id) {
      return NextResponse.json({ error: "You are not the owner of this team" }, { status: 403 });
    }
    if (team.teamModerators.some((member) => member.id === body.moderatorId)) {
      return NextResponse.json({ error: "This user is already a moderator" }, { status: 403 });
    }
    if (team.teamMembers.some((member) => member.id === body.moderatorId)) {
      return NextResponse.json({ error: "This user is already a member" }, { status: 403 });
    }
    if (team.teamOwnerId === body.moderatorId) {
      return NextResponse.json({ error: "You can't add yourself as a moderator" }, { status: 403 });
    }
    const moderator = await db.profile.findUnique({
      where: {
        id: body.moderatorId
      }
    })
    if (!moderator) {
      return NextResponse.json({ error: "Can't find a user" }, { status: 404 });
    }
    if (moderator.id === profile.id) {
      return NextResponse.json({ error: "You can't add yourself as a moderator" }, { status: 403 });
    }
    if (team.teamModerators.some((member) => member.id === body.moderatorId)) {
      return NextResponse.json({ error: "This user is already a moderator" }, { status: 403 });
    }
    if (team.teamMembers.some((member) => member.id === body.moderatorId)) {
      return NextResponse.json({ error: "This user is already a member" }, { status: 403 });
    }
    if (team.teamOwnerId === body.moderatorId) {
      return NextResponse.json({ error: "You can't add yourself as a moderator" }, { status: 403 });
    }
    const newModerator = await db.teams.update({
      where: {
        teamId: body.teamId
      },
      data: {
        teamModerators: {
          connect: {
            id: body.moderatorId
          }
        }
      }
    })
    if (!newModerator) {
      return NextResponse.json({ error: "Can't add a moderator" }, { status: 404 });
    }
    return NextResponse.json(newModerator, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const profile = await currentProfile();
    console.log(profile);

    if (!profile) {
      return NextResponse.json(
        { error: 'User not logged in' },
        { status: 403 }
      )
    }

    const body = await request.json();

    const team = await db.teams.findUnique({
      where: {
        teamId: body.teamId
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
    if (!team) {
      return NextResponse.json({ error: "Can't find a team" }, { status: 404 });
    }
    if (team.teamOwnerId !== profile.id) {
      return NextResponse.json({ error: "You are not the owner of this team" }, { status: 403 });
    }
    if (!team.teamModerators.some((member) => member.id === body.moderatorId)) {
      return NextResponse.json({ error: "This user is not a moderator" }, { status: 403 });
    }
    if (team.teamMembers.some((member) => member.id === body.moderatorId)) {
      return NextResponse.json({ error: "This user is already a member" }, { status: 403 });
    }
    if (team.teamOwnerId === body.moderatorId) {
      return NextResponse.json({ error: "You can't remove yourself as a moderator" }, { status: 403 });
    }
    const moderator = await db.profile.findUnique({
      where: {
        id: body.moderatorId
      }
    })
    if (!moderator) {   
      return NextResponse.json({ error: "Can't find a user" }, { status: 404 });
    }
    if (moderator.id === profile.id) {
      return NextResponse.json({ error: "You can't remove yourself as a moderator" }, { status: 403 });
    }
    if (!team.teamModerators.some((member) => member.id === body.moderatorId)) {
      return NextResponse.json({ error: "This user is not a moderator" }, { status: 403 });
    }
    if (team.teamMembers.some((member) => member.id === body.moderatorId)) {
      return NextResponse.json({ error: "This user is already a member" }, { status: 403 });
    }
    if (team.teamOwnerId === body.moderatorId) {
      return NextResponse.json({ error: "You can't remove yourself as a moderator" }, { status: 403 });
    }
    const newModerator = await db.teams.update({
      where: {
        teamId: body.teamId
      },
      data: {
        teamModerators: {
          disconnect: {
            id: body.moderatorId
          }
        }
      }
    })
    if (!newModerator) {
      return NextResponse.json({ error: "Can't remove a moderator" }, { status: 404 });
    }
    return NextResponse.json(newModerator, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
