'use client';

import { SessionProvider } from 'next-auth/react';
import localFont from 'next/font/local';
import './globals.css';
import SignOutButton from '../components/signout';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
    <SessionProvider>
      <SignOutButton />
      {children}
    </SessionProvider>
    </body>
    </html>
  );
}