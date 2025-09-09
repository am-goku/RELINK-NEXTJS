import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef } from 'react'
import ChatHeader from './header.chat';
import ChatComposer from './composer.chat';



type Props = {
    activeRoomId: string | null;
    rooms: Room[];
    setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
    messagesByRoom: Record<string, Message[]>;
    setMessagesByRoom: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;
    sidebarOpen: boolean | null;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
}

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


function MessageArea({
    activeRoomId, messagesByRoom, rooms, sidebarOpen,
    setMessagesByRoom, setRooms, setSidebarOpen
}: Props) {

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const activeRoom = rooms.find((r) => r.id === activeRoomId) || null;
    const activeMessages = activeRoomId ? messagesByRoom[activeRoomId] || [] : [];
    const participant = activeRoom ? activeRoom.participants.find((p) => p !== "me") : null;
    const participantUser = participant ? MOCK_USERS[participant] : undefined;

    return (
        <React.Fragment>
            <main className={`flex-1 flex flex-col ${sidebarOpen === true && "hidden"}`}>
                {/* Chat Header */}
                <ChatHeader participantUser={participantUser} setSidebarOpen={setSidebarOpen} />

                {/* Messages */}
                <div className="flex-1 overflow-auto p-4 bg-[#F8F9FB] dark:bg-neutral-900/50">
                    <AnimatePresence mode="wait">
                        {activeRoomId ? (
                            <motion.div key={activeRoomId} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 max-w-3xl mx-auto">
                                {activeMessages.map((msg) => {
                                    const isMe = msg.from === "me";
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                            <div className={`rounded-2xl p-3 shadow-sm max-w-[82%] ${isMe ? "bg-[#2D3436] text-white" : "bg-white dark:bg-neutral-800 text-[#2D3436]"}`}>
                                                {msg.text && <div className="whitespace-pre-wrap">{msg.text}</div>}
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                {msg.image && <img src={msg.image} alt="attached" className="mt-2 rounded-md object-cover max-h-72" />}
                                                <div className="text-[11px] mt-2 opacity-60 text-right">{msg.timestamp}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm opacity-70 mt-12">No conversation selected</motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Composer */}
                <ChatComposer
                    activeRoomId={activeRoomId}
                    setMessagesByRoom={setMessagesByRoom}
                    setRooms={setRooms} />
            </main>
        </React.Fragment>
    )
}

export default MessageArea