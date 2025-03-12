import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from '@/lib/current-profile';

export async function PATCH(req: Request, { params }:  { params: Promise<{collectionId: string}>}) {
  try {
    const user = await currentProfile();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { collectionId } = await params;
    if (!collectionId) {
      return NextResponse.json({ error: "Bad Request: Missing collectionId" }, { status: 400 });
    }
    
    console.log(user.id);
    
    
    const codat = await db.codat.findFirst({
      where: { collectionId, authorId: user.id }
    });
    
    if (!codat) {
      return NextResponse.json({ error: "Forbidden: You are not the author of this Codat" }, { status: 403 });
    }
    
    const rawBody = await req.text();
    let requestBody;
    try {
      requestBody = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }
    
    const { collectionName, collectionDesc, collectionColor } = requestBody;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (collectionName) {
      updateData.collectionName = collectionName;
    }
    if (collectionDesc) {
      updateData.collectionDesc = collectionDesc;
    }
    if (collectionColor) {
      updateData.collectionColor = collectionColor;
    }

    const updatedCollection = await db.collections.update({
      where: { collectionId: collectionId },
      data: updateData
    });
    
    return NextResponse.json({
      message: "`Collection` updated successfully",
      collection: updatedCollection
    });
    
  } catch (error) {
    console.error("Error updating Codat:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}