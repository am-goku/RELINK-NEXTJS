'use client';

import LoaderScreen from "@/components/ui/loader/LoaderScreen";
import apiInstance from "@/lib/axios";
import { SanitizedUser } from "@/utils/sanitizer/user";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useCallback, useContext, createContext, useState } from "react";


interface UserContextType {
    user: SanitizedUser | null;
    setUser: React.Dispatch<React.SetStateAction<SanitizedUser | null>>;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<SanitizedUser | null>(null);
    const { status } = useSession();

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiInstance.get('/api/auth/user');
            setUser(res?.data?.user);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Failed to fetch authenticated user:", error);

            signOut();
        } finally {
            setLoading(false);
        }
    }, [setUser]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchUser();
        }
    }, [status, fetchUser]);

    if (status === "loading") {
        return <LoaderScreen />
    }

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}


export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}