import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import React from 'react'

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


type Props = {
    searchResults: User[];
    rooms: Room[];
    query: string;
    sidebarOpen: boolean | null;
    activeRoomId: string | null;
    setActiveRoomId: (id: string) => void;
    setQuery: (query: string) => void;
    setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
    setMessagesByRoom: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;
    setSearchResults: React.Dispatch<React.SetStateAction<User[]>>
}

function ChatSidebar({
    searchResults, rooms, query, activeRoomId, sidebarOpen,
    setActiveRoomId, setQuery, setRooms,
    setMessagesByRoom, setSidebarOpen, setSearchResults
}: Props) {

    function handleSelectRoom(id: string) {
        setActiveRoomId(id);
        setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, unread: 0 } : r)));
        if (window.innerWidth < 768) setSidebarOpen(false);
    }

    function handleStartChatWith(userId: string) {
        const existing = rooms.find((r) => r.participants.includes(userId) && r.participants.includes("me"));
        if (existing) return handleSelectRoom(existing.id);

        const newRoom: Room = {
            id: `r-${Date.now()}`,
            participants: ["me", userId],
            updatedAt: new Date().toISOString(),
            unread: 0,
        };
        setRooms((p) => [newRoom, ...p]);
        setMessagesByRoom((m) => ({ ...m, [newRoom.id]: [] }));
        setActiveRoomId(newRoom.id);
        setQuery("");
        setSearchResults([]);
        if (window.innerWidth < 768) setSidebarOpen(false);
    }

    return (
        <React.Fragment>
            <aside className={`flex-shrink-0 w-full md:w-80 border-r border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-neutral-800/70 transition-transform ${sidebarOpen === true ? "translate-x-0 block h-screen" : sidebarOpen === false ? "-translate-x-full md:translate-x-0 hidden" : ""}`}>
                <div className="p-3">
                    <div className="relative">
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users or rooms" className="w-full rounded-xl border px-3 py-2 text-sm outline-none" />
                        <Search className="absolute right-3 top-2.5 h-4 w-4 opacity-70" />
                    </div>
                    <AnimatePresence>
                        {searchResults.length > 0 && (
                            <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 max-h-40 overflow-auto rounded-lg border bg-white dark:bg-neutral-900 p-2">
                                {searchResults.map((u) => (
                                    <li key={u.id} className="flex items-center gap-3 px-2 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md cursor-pointer" onClick={() => handleStartChatWith(u.id)}>
                                         {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={u.avatar} alt='' className="w-9 h-9 rounded-full object-cover" />
                                        <div className="flex-1 text-sm">
                                            <div className="font-medium">{u.name}</div>
                                            <div className="text-xs opacity-70">@{u.username}</div>
                                        </div>
                                        <button className="text-sm text-blue-600">Message</button>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="p-3 overflow-auto max-h-[calc(100vh-200px)]">
                    <ul className="space-y-2">
                        {rooms.map((room) => {
                            const other = room.participants.find((p) => p !== "me");
                            const user = other ? MOCK_USERS[other] : undefined;
                            return (
                                <li key={room.id}>
                                    <button
                                        onClick={() => handleSelectRoom(room.id)}
                                        className={`w-full text-left rounded-xl p-2 flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 ${activeRoomId === room.id ? "bg-light-bg/90 dark:bg-dark-bg/90" : ""}`}
                                    >
                                        <div className="relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={user?.avatar} alt='' className="w-10 h-10 rounded-full object-cover" />
                                            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user?.online ? "bg-green-500" : "bg-gray-400"}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="font-medium text-sm">{user?.name}</div>
                                                {room.unread ? <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[11px]">{room.unread}</span> : null}
                                            </div>
                                            <div className="text-xs opacity-70 truncate">{room.lastMessage}</div>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </React.Fragment>
    )
}

export default ChatSidebar