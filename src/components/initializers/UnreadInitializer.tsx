"use client";

import apiInstance from "@/lib/axios";
import { useUnreadStore } from "@/stores/unreadStore";
import { Session } from "next-auth";
import { useEffect } from "react";

export function UnreadInitializer({ session }: { session: Session | null }) {

    const setUnread = useUnreadStore((s) => s.setUnread);

    useEffect(() => {
        if (session) {
            async function loadUnread() {
                const res = await apiInstance.get("/api/conversations/unread");
                if (!res.data) return;
                const data: { conversation_id: string; unreadCount: number }[] = await res.data;
                data.forEach(({ conversation_id, unreadCount }) => {
                    setUnread(conversation_id, unreadCount);
                });
            }
            loadUnread();
        }
    }, [setUnread, session]);

    return null; // nothing to render, just initializes
}