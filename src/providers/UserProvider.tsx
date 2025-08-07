'use client';

import { useCallback, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useUserStore } from '@/stores/userStore';
import { authService } from '@/services/apiServices';

export default function UserProvider({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const setUser = useUserStore((state) => state.setUser);
    const clearUser = useUserStore((state) => state.clearUser);

    const fetchUser = useCallback(async () => {
        try {
            const res = (await authService.getAuthenticatedUser()).data;
            setUser(res?.user);
        } catch (error) {
            console.log(error);
        }
    }, [setUser]);

    useEffect(() => {
        try {
            if (status === 'authenticated') {
                fetchUser();
            } else if (status === 'unauthenticated') {
                clearUser();
            }
        } catch (error) {
            console.log(error);
            signOut()
        }
    }, [clearUser, fetchUser, status]);

    return children
}
