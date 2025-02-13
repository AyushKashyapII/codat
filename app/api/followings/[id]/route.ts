import {currentProfile} from "@/lib/current-profile";
import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{id: string}> }) {
  try {
    const profile = await currentProfile();
    console.log(profile);

    if (!profile) {
      return NextResponse.json(
        { error: 'User not logged in' },
        { status: 403 }
      )
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "id of user to follow is required" }, { status: 403 })
    }

    const alreadyFollow = await db.userFollow.findFirst({
      where: {
        followingId: id,
        followerId: profile.id
      }
    })

    if (alreadyFollow) {
      return NextResponse.json({ error: "User already following user" }, { status: 403 })
    }

    const follow = await db.userFollow.create({
      data: {
        followingId: id,
        followerId: profile.id
      }
    })

    if (!follow) {
      return NextResponse.json({ error: "failed to follow user" }, { status: 500 })
    }

    return NextResponse.json({ status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest, { params }: { params: Promise<{id: string}> }) {
  try {
    const profile = await currentProfile();
    console.log(profile);

    if (!profile) {
      return NextResponse.json(
        { error: 'User not logged in' },
        { status: 403 }
      )
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "id of user to follow is required" }, { status: 403 })
    }

    const unfollow = await db.userFollow.deleteMany({
      where: {
        followingId: id,
        followerId: profile.id
      }
    })

    if (!unfollow) {
      return NextResponse.json({ error: "failed to follow user" }, { status: 500 })
    }

    return NextResponse.json({ status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}