"use client";

import React, { useCallback, useEffect, useState } from "react";
import MessageArea from "@/components/client/chat/message.chat";
import ChatSidebar from "@/components/client/chat/sidebar.chat";
import Header from "@/components/nav/header";
import { Session } from "next-auth";
import { useChatStore } from "@/stores/chatStore";
import apiInstance from "@/lib/axios";

export default function ChatRoomsPage({ session }: { session: Session }) {
    // Chat Room State
    const setRooms = useChatStore((state) => state.setChatRooms);
    const activeRoom = useChatStore((state) => state.selectedRoom);

    const [newChat, setNewChat] = useState(false);

    // UI States
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [minScreen, setMinScreen] = useState<boolean>(false);

    // UI Logic
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 768) {
                setMinScreen(true);
                if (activeRoom) setSidebarOpen(false);
            } else {
                setMinScreen(false);
                setSidebarOpen(true);
            }
        }

        // Run once on mount
        handleResize();

        // Listen for resize
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [activeRoom]);

    // API LOGIC
    const fetchRooms = useCallback(async () => {
        if (session) {
            // setRoomsLoading(true);
            const chatRooms = (await apiInstance.get('/api/chat/conversation')).data.conversations;
            setRooms(chatRooms);
            // setRoomsLoading(false);
        }
    }, [session, setRooms]);
    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]); // Fetching rooms on mount

    return (
        <div className="flex flex-col h-screen bg-[#F0F2F5] dark:bg-neutral-900">
            {/* Page Header */}
            <Header page="chat" />

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#F0F2F5] dark:bg-neutral-900 text-[#2D3436] dark:text-gray-200">

                {/* Sidebar */}
                <ChatSidebar
                    setNewChat={setNewChat}
                    session={session}
                    minScreen={minScreen}
                    sidebarOpen={sidebarOpen} />

                {/* Message Area */}
                <MessageArea
                    newChat={newChat}
                    setNewChat={setNewChat}
                    session={session}
                    minScreen={minScreen}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen} />
            </div>
        </div>
    );
}