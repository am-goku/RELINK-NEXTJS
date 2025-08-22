'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Optional: configure once
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.25 });

export default function NProgressProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        // Start progress
        NProgress.start();

        // Simulate async transition end
        const timer = setTimeout(() => {
            NProgress.done();
        }, 300); // delay for smoother UX

        return () => {
            clearTimeout(timer);
        };
    }, [pathname]);

    return <>{children}</>;
}
