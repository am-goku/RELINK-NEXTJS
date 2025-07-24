'use client';

import LoaderScreen from '@/components/loaders/LoaderScreen';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

// List of public paths that don't require auth
const publicPaths = ['/auth/login', '/auth/signup'];

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    if (status === 'unauthenticated' && !isPublicPath) {
      console.log(status)
      router.replace('/auth/login');
    }
  }, [status, isPublicPath, router]);

  // Show loader if session is loading and not a public path
  if (status === 'loading' && !isPublicPath) {
    return <LoaderScreen />;
  }

  // If it's a public path, show children regardless of session
  if (isPublicPath) {
    return children;
  }

  // If not authenticated and not a public path, wait for redirect
  if (!session && !isPublicPath) {
    return null;
  }

  return children;
}
