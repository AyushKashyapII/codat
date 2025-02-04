import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  console.log('Fetching profile for:', params.username);

  const { username } = params;

  if (!username) {
    return NextResponse.json({ error: 'Invalid username parameter' }, { status: 400 });
  }

  try {
    const profile = await db.profile.findUnique({
      where: { name: username },
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

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
