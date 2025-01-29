import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';
import {db} from "@/lib/db";


export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email, name } = token;

  try {
    const user = await db.user.upsert({
      where: { email: email as string },
      update: { name: name as string },
      create: {
        email: email as string,
        name: name as string,
      },
    });

    console.log('User saved successfully:', user);
    return NextResponse.json({ message: 'User saved successfully', user });
  } catch (error) {
    console.error('Error saving user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}