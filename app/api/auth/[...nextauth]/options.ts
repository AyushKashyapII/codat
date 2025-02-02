import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { JWT } from 'next-auth/jwt';
import { Session, SessionStrategy } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/db';

interface CustomUser {
  id: string;
  email: string;
  name: string;
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user?: CustomUser }) {
      console.log('JWT callback triggered:', token);
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.name;
        }
      }
      return token;
    },

    async session({ session, token }: { session: Session, token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string || '';
        session.user.email = token.email as string || '';
        session.user.name = token.name as string || '';
      } else {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
        };
      }
      console.log(session);
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);
