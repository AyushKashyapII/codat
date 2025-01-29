import NextAuth from 'next-auth';
import { authOptions } from './options';  // Import the options correctly

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };  // Properly export GET and POST