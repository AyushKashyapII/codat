import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  try {
    console.log('Middleware triggered for:', req.url);

    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    if (!token) {
      console.warn('No valid token found. Redirecting to login.');
      return NextResponse.redirect(new URL('/', req.url));
    }

    console.log('Valid token found:', token);

    return NextResponse.next();
  } catch (error) {
    console.error('Error in middleware:', error);

    return NextResponse.redirect(new URL('/error', req.url));
  }
}

export const config = {
  matcher: ['/home'],

  runtime: 'nodejs',
};