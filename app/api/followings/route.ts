import {currentProfile} from "@/lib/current-profile";
import {NextResponse} from "next/server";
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

    const followings = await db.userFollow.findMany({
      where: {
        followerId: profile.id
      },
      select: {
        following: {
          select: {
            name: true,
            id: true,
            email: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json(followings, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}