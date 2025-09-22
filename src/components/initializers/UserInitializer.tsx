'use client'

import apiInstance from "@/lib/axios";
import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react"

function UserInitializer() {

    const fetchUser = async () => {
        const user = (await apiInstance.get("/api/auth/user")).data;
        useUserStore.getState().setUser(user);
        console.log("user from initializer", user);
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return null
}

export default UserInitializer