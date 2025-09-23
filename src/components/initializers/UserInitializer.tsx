'use client'

import apiInstance from "@/lib/axios";
import { useUserStore } from "@/stores/userStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react"

function UserInitializer() {

    const { data: session } = useSession();

    const fetchUser = async () => {
        const user = (await apiInstance.get("/api/auth/user")).data;
        useUserStore.getState().setUser(user);
    }

    useEffect(() => {
        if (session) fetchUser();
    }, [session])

    return null
}

export default UserInitializer