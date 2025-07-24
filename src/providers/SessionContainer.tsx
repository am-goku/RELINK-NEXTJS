'use client'

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react'
import nProgress from 'nprogress';
import { useRouter } from 'next/navigation';

function SessionContainer({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') {
            nProgress.start();
        } else {
            nProgress.done();
        }
    }, [status]);

    // Redirect if no session
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    if (!session) {
        return null; // Optionally render a loading spinner here
    }

    return <>{children}</>;
}

export default SessionContainer;
