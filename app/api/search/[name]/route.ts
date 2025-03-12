import {NextRequest, NextResponse} from "next/server";
import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";

export async function GET(req: NextRequest, { params}: { params: Promise<{name: string}> }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json(
        { error: 'User not logged in' },
        { status: 403 }
      )
    }

    const { name } = await params;

    if (!name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 403 }
      )
    }

    console.log(name)

    const users = await db.profile.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive"
        }
      },
      select: {
        id: true,
        name: true,
        image: true,
        email:true,
      }
    })
    console.log("user ",users)

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}