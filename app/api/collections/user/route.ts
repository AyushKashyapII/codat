//get all collections

import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";
import {auth} from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'User not logged in' },
        { status: 403 }
      )
    }

    const { collectionDesc, collectionName } = await req.json();

    if (!collectionDesc || !collectionName) {
      return NextResponse.json(
        { error: 'data not found' },
        { status: 403 }
      )
    }
    // const alreadyExist = await db.collections.findFirst({
    //   where: {
    //     collectionName
    //   }
    // })
    console.log("few checks done");

    // if (alreadyExist !== null) {
    //   return NextResponse.json(
    //     { error: "collections with same name already exits"},
    //     { status: 403 }
    //   )
    // }

    console.log("createing ")

    
    const collection = await db.collections.create({
      data: {
        collectionDesc,
        collectionName,
        collectionOwnerId: userId,
        collectionColor: "#FF5733",
      }
    })

    console.log("created",collection)    
    return NextResponse.json({ status: 200 })
  } catch (e) {
    return NextResponse.json(
      { error: `Internal Server error: ${e}` },
      { status: 500 }
    );
  }
}