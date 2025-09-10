"use client";

import React, { useEffect, useRef, useState } from "react";
import MessageArea from "@/components/client/chat/message.chat";
import ChatSidebar from "@/components/client/chat/sidebar.chat";
import Header from "@/components/nav/header";

type User = {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    online?: boolean;
};

type Message = {
    id: string;
    from: string;
    text?: string;
    image?: string;
    timestamp: string;
    read?: boolean;
};

type Room = {
    id: string;
    participants: string[];
    lastMessage?: string;
    updatedAt?: string;
    unread?: number;
};

// Mock users
const MOCK_USERS: Record<string, User> = {
    u1: { id: "u1", name: "Asha Menon", username: "asham", avatar: "https://i.pravatar.cc/80?img=32", online: true },
    u2: { id: "u2", name: "Ravi Kumar", username: "ravik", avatar: "https://i.pravatar.cc/80?img=12", online: false },
    u3: { id: "u3", name: "Neha Singh", username: "nehasingh", avatar: "https://i.pravatar.cc/80?img=5", online: true },
    me: { id: "me", name: "You", username: "you", avatar: "https://i.pravatar.cc/80?img=7", online: true },
};

// Mock rooms
const MOCK_ROOMS: Room[] = [
    { id: "r1", participants: ["me", "u1"], lastMessage: "See you tomorrow!", updatedAt: new Date().toISOString(), unread: 2 },
    { id: "r2", participants: ["me", "u2"], lastMessage: "Sent the files.", updatedAt: new Date().toISOString(), unread: 0 },
    { id: "r3", participants: ["me", "u3"], lastMessage: "Love this!", updatedAt: new Date().toISOString(), unread: 5 },
];

// Mock messages
const MOCK_MESSAGES: Record<string, Message[]> = {
    r1: [
        { id: "m1", from: "u1", text: "Hey! you free tomorrow?", timestamp: "10:12 AM", read: true },
        { id: "m2", from: "me", text: "Maybe after 5pm", timestamp: "10:13 AM", read: true },
        { id: "m3", from: "u1", text: "Perfect — let's meet.", timestamp: "10:14 AM", read: false },
    ],
    r2: [
        { id: "m4", from: "u2", text: "I've uploaded the designs.", timestamp: "9:05 AM", read: true },
        { id: "m5", from: "me", text: "Checking now — thanks!", timestamp: "9:10 AM", read: true },
        { id: "m6", from: "u2", image: "https://picsum.photos/seed/design/600/400", timestamp: "9:12 AM", read: false },
    ],
    r3: [
        { id: "m7", from: "u3", text: "Short clip from my trip", timestamp: "Yesterday", read: false },
        { id: "m8", from: "me", text: "Nice!", timestamp: "Yesterday", read: false },
        { id: "m9", from: "u3", image: "https://picsum.photos/seed/trip/700/700", timestamp: "Yesterday", read: false },
    ],
};

export default function ChatRoomsPage() {
    const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
    const [activeRoomId, setActiveRoomId] = useState<string | null>(MOCK_ROOMS[0].id);
    const [messagesByRoom, setMessagesByRoom] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // UI States
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [minScreen, setMinScreen] = useState<boolean>(false);

    useEffect(() => {
        if (!query) return setSearchResults([]);
        const q = query.toLowerCase();
        const results = Object.values(MOCK_USERS).filter((u) => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q));
        setSearchResults(results);
    }, [query]);

    // Scroll to bottom
    useEffect(() => scrollToBottom(), [activeRoomId, messagesByRoom]);

    // UI Logic
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 768) {
                setMinScreen(true);
                if (activeRoomId) setSidebarOpen(false);
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
    }, [activeRoomId]);


    function scrollToBottom() {
        if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }


    return (
        <div className="flex flex-col h-screen bg-[#F0F2F5] dark:bg-neutral-900">
            {/* Page Header */}
            <Header page="chat" />



            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#F0F2F5] dark:bg-neutral-900 text-[#2D3436] dark:text-gray-200">

                {/* Sidebar */}
                <ChatSidebar
                    minScreen={minScreen}
                    searchResults={searchResults}
                    setActiveRoomId={setActiveRoomId}
                    activeRoomId={activeRoomId}
                    rooms={rooms}
                    setRooms={setRooms}
                    setMessagesByRoom={setMessagesByRoom}
                    setSidebarOpen={setSidebarOpen}
                    sidebarOpen={sidebarOpen}
                    query={query}
                    setSearchResults={setSearchResults}
                    setQuery={setQuery} />

                {/* Message Area */}
                <MessageArea
                    activeRoomId={activeRoomId}
                    messagesByRoom={messagesByRoom}
                    minScreen={minScreen}
                    rooms={rooms}
                    sidebarOpen={sidebarOpen}
                    setMessagesByRoom={setMessagesByRoom}
                    setRooms={setRooms}
                    setSidebarOpen={setSidebarOpen} />
            </div>
        </div>
    );
}