"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
// import { useUser } from "./UserProvider";
import LoaderScreen from "@/components/loaders/LoaderScreen";
import { useSession } from "next-auth/react";

const publicRoutes = ["/", "/auth/login", "/auth/signup"];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicPath = publicRoutes.includes(pathname);

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
