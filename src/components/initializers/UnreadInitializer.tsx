"use client";

import apiInstance from "@/lib/axios";
import { useUnreadStore } from "@/stores/unreadStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function UnreadInitializer() {

    const { data: session, status } = useSession();

    const setUnread = useUnreadStore((s) => s.setUnread);
    const clearUnreadStore = useUnreadStore((s) => s.clearState);

    useEffect(() => {
        if (status === "authenticated") {
            async function loadUnread() {
                const res = await apiInstance.get("/api/chat/conversation/unread");
                if (!res.data) return;
                const data: { conversation_id: string; unreadCount: number }[] = await res.data;
                data.forEach(({ conversation_id, unreadCount }) => {
                    setUnread(conversation_id, unreadCount);
                });
            }
            loadUnread();
        } else if (status === "unauthenticated") {
            clearUnreadStore();
        }
    }, [setUnread, session, status, clearUnreadStore]);

    return null; // nothing to render, just initializes
}