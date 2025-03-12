// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const profile = await currentProfile();
    
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    
    const fullProfile = await db.profile.findUnique({
      where: { 
        id: profile.id 
      },
      include: {
        codatsAuthored: true,
        codatsSaved: true,
        teamsPartsOf: true,
        teamsOwnerOf: true,
        teamsModeratorOf: true,
        codatsCollections: true,
        usersFollowed: {
          include: {
            following: true,
          },
        },
      },
    });
    
    if (!fullProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    
    return NextResponse.json(fullProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}