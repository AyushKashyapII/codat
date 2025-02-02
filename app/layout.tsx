'use client';

import localFont from 'next/font/local';
import './globals.css';
import {ClerkProvider} from "@clerk/nextjs"

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
    <ClerkProvider
    afterSignOutUrl="/"
    >
    <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </body>
    </html>
    </ClerkProvider>
  );
}