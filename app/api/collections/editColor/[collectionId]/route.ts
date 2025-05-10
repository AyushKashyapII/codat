import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from '@/lib/current-profile';

export async function PATCH(
  req: Request, 
  { params }: { params: { collectionId: string } }
) {
  try {
    const user = await currentProfile();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const { collectionId } = await params;
    const { collectionName, collectionColor } = await req.json();
    
    // Validate inputs
    if (!collectionId) {
      return new NextResponse("Collection ID is required", { status: 400 });
    }
    
    if (!collectionName && !collectionColor) {
      return new NextResponse("No values to update", { status: 400 });
    }
    
    // Check if collection exists and belongs to the user
    const existingCollection = await db.collections.findFirst({
      where: {
        collectionId: collectionId,
        collectionOwnerId: user.id
      }
    });
    
    if (!existingCollection) {
      return new NextResponse("Collection not found or you don't have permission", { status: 404 });
    }
    
    // Update the collection
    const updatedCollection = await db.collections.update({
      where: {
        collectionId: collectionId
      },
      data: {
        collectionName: collectionName || existingCollection.collectionName,
        collectionColor: collectionColor || existingCollection.collectionColor
      }
    });
    
    return NextResponse.json(updatedCollection);
  } catch (error) {
    console.error("[COLLECTION_UPDATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}