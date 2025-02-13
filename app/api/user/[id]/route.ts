import {NextRequest, NextResponse} from "next/server";
import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";

export async function GET(req: NextRequest, { params}: { params: Promise<{id: string}> }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json(
        { error: 'User not logged in' },
        { status: 403 }
      )
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 403 }
      )
    }

    console.log("here")

    const user = await db.profile.findUnique({
      where: {
        id
      },
      select: {
        name: true,
        id: true,
        image: true,
        usersFollowing: {
          where: {
            followerId: profile.id
          },
          select: {
            id: true,
          }
        },
        teamsPartsOf: {
          select: {
            teamId: true,
            teamName: true,
          }
        },
        teamsModeratorOf: {
          select: {
            teamId: true,
            teamName: true,
          }
        },
        teamsOwnerOf: {
          select: {
            teamId: true,
            teamName: true,
          }
        },
        codatsCollections: {
          select: {
            collectionId: true,
            collectionName: true,
            _count: {
              select: {
                collectionCodats: true
              }
            }
          }
        },
        _count: {
          select: {
            usersFollowing: true,
            usersFollowed: true,
            codatsCollections: true,
            codatsAuthored: true,
            teamsPartsOf: true,
            teamsModeratorOf: true,
            teamsOwnerOf: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "user not found" },
        { status: 404 }
      )
    }

    console.log(user)

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}