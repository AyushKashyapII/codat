import {currentProfile} from "@/lib/current-profile";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function GET() {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json(
        { error: 'User not logged in' },
        { status: 403 }
      )
    }

    const followers = await db.userFollow.findMany({
      where: {
        followingId: profile.id
      },
      select: {
        follower: {
          select: {
            name: true,
            id: true,
            email: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json(followers, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}