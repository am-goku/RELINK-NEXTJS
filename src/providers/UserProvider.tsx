'use client';

import { useCallback, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useUserStore } from '@/stores/userStore';
import { API_ROUTES } from '@/constants/apiRoutes';
import apiInstance from '@/lib/axios';

export default function UserProvider({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const setUser = useUserStore((state) => state.setUser);
    const clearUser = useUserStore((state) => state.clearUser);

    const fetchUser = useCallback(async () => {
        const res = await apiInstance.get(API_ROUTES.AUTH.GET_AUTHENTICATE_USER);
        console.log(res)
        setUser(res.data.user);
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
