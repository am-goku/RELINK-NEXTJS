'use client'

import Navbar from '@/components/ui/navbar/Navbar';
import { fetchConversations } from '@/services/api/chat-apis';
import { useChatStore } from '@/stores/chatStore';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Session } from 'next-auth';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoomList from './RoomList';
import ChatListheader from './ChatListHeader';

type Props = {
    session: Session | null;
    children: React.ReactNode;
};

function ChatLayoutClient({ session, children }: Props) {
    const params = useParams();

    const chatRooms = useChatStore((state) => state.chatRooms);
    const setChatRooms = useChatStore((state) => state.setChatRooms);
    const selectedRoom = useChatStore((state) => state.selectedRoom);
    const setSelectedRoom = useChatStore((state) => state.setSelectedRoom);

    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [roomsLoading, setRoomsLoading] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

    useEffect(() => {
        const room = chatRooms.find((c) => c._id.toString() === params?.id);
        if (room) setSelectedRoom(room);
    }, [chatRooms, params, setSelectedRoom]);

    const fetchRooms = useCallback(async () => {
        if (session) {
            setRoomsLoading(true);
            const chatRooms = await fetchConversations();
            setChatRooms(chatRooms);
            setRoomsLoading(false);
        }
    }, [session, setChatRooms]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <React.Fragment>
            <div className="h-screen flex-grow pt-20 flex flex-col min-h-screen">
                <Navbar type="chat" session={session} />

                <div className="h-[calc(100vh-80px)] flex bg-[#F0F2F5] dark:bg-neutral-900 text-[#2D3436] dark:text-gray-200 transition-colors relative overflow-hidden">

                    {/* Sidebar */}
                    <AnimatePresence initial={false}>
                        {(!isMobile || (isMobile && !selectedRoom)) && sidebarOpen && (
                            <motion.aside
                                key="sidebar"
                                initial={{ x: -300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="md:w-72 w-full md:flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-800 shadow-sm z-10"
                            >
                                <ChatListheader conversations={chatRooms} />
                                <RoomList
                                    chatRooms={chatRooms}
                                    selectedRoom={selectedRoom}
                                    session={session}
                                    setSelectedRoom={setSelectedRoom}
                                    loading={roomsLoading}
                                />
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Toggle Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-neutral-700 border rounded-r-lg shadow px-1 py-2 hidden md:flex"
                    >
                        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>

                    {/* Chat Area */}
                    <div
                        className={clsx(
                            'flex flex-col sm:px-1 w-full transition-all duration-300',
                            isMobile && !selectedRoom && 'hidden'
                        )}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ChatLayoutClient;
