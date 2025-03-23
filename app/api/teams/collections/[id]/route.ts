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
    
    if (!id) {
      return NextResponse.json({ error: "id not found "}, { status: 403 })
    }
    
    const collection = await db.collections.findUnique({
      where: {
        collectionId: id
      },
      select: {
        collectionName: true,
        collectionDesc: true,
        collectionId:true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            collectionCodats: true
          }
        },
        collectionOwner: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        collectionCodats: {
          select: {
            codatAuthor: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            codatName: true,
            codatId: true,
          }
        }
      }
    })
    
    if (!collection) {
      return NextResponse.json({ error: "collection not found"}, { status: 404 })
    }

    console.log("collection /id team", collection);
    
    return NextResponse.json(collection, { status: 200 })
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest, { params }: { params: Promise<{id: string}> }) {
  try {
    const profile = await currentProfile();
    console.log(profile);
    
    if (!profile) {
      return NextResponse.json(
        {error: 'User not logged in'},
        {status: 403}
      )
    }
    
    const {id} = await params;
    
    if (!id) {
      return NextResponse.json({ error: "id not found "}, { status: 403 })
    }
    
    const { collectionName, collectionDesc } = await req.json();
    
    if (!collectionName || !collectionDesc ) {
      return NextResponse.json({ error: "collection name and collections description is required" }, { status: 403 });
    }
    
    const collection  = await db.teams.update({
      where: {
        teamId: id,
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
      data: {
        teamCollections: {
          create: {
            collectionName,
            collectionDesc,
            collectionOwnerId: profile.id
          }
        }
      }
    })
    
    if (!collection) {
      return NextResponse.json({ error: "failed to create collection" }, { status: 500 })
    }
    
    return NextResponse.json({ status: 200 })
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}
