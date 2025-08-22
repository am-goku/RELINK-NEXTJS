'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderWrapperProps {
  children: ReactNode;
  session?: Session | null; // will come from NextAuth (usually typed with Session)
}

export default function SessionProviderWrapper({
  children,
  session,
}: SessionProviderWrapperProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
