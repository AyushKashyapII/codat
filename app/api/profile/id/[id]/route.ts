import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }){
  try {
    const { id } =  params;
    console.log("id ",id)
    
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    const fullProfile = await db.profile.findUnique({
        where: { 
          id: id 
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

      //console.log("full profile of search user",fullProfile)
      
      return NextResponse.json(fullProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  }
    
   