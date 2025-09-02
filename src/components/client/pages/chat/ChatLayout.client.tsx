'use client'

import Navbar from '@/components/ui/navbar/Navbar';
import { IConversationPopulated } from '@/models/Conversation';
import { fetchConversations } from '@/services/api/chat-apis';
import clsx from 'clsx';
import { MessageCircle, UserPlus } from 'lucide-react';
import { Session } from 'next-auth';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'

type Props = {
    session: Session | null;
    children: React.ReactNode;
}

function ChatLayoutClient({ session, children }: Props) {

    const params = useParams();
    const router = useRouter();


    // Conversation state
    const [conversations, setConversations] = useState<IConversationPopulated[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<IConversationPopulated | null>(null);

    // UI States
    const [isMobile, setIsMobile] = useState(false);
    const [showNewChatModal, setShowNewChatModal] = useState(false);


    // Setting selected user state
    useEffect(() => {
        const room = conversations.find((c) => c._id.toString() === params?.id);
        if (room) {
            setSelectedRoom(room);
        }
        console.log(room)
    }, [conversations, params])

    // Conversations fetching
    const fetchRooms = useCallback(async () => {
        if (session) {
            const conversations = await fetchConversations();
            setConversations(conversations);
        }
    }, [session]);
    useEffect(() => {
        fetchRooms();
    }, [fetchRooms])

    // Responsive design handling
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

                <div className="h-[calc(100vh-80px)] flex bg-[#F0F2F5] dark:bg-neutral-900 text-[#2D3436] dark:text-gray-200 transition-colors">

                    {/* Sidebar */}
                    <aside
                        className={clsx(
                            'md:w-72 w-full md:flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-800 shadow-sm',
                            isMobile && selectedRoom ? 'hidden' : 'flex'
                        )}
                    >
                        <div className="p-4 border-b text-lg font-semibold flex items-center gap-2 justify-between border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <MessageCircle size={20} /> Messages
                            </div>
                            <button
                                onClick={() => setShowNewChatModal(true)}
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                title="Start new chat"
                            >
                                <UserPlus size={18} />
                            </button>
                        </div>

                        {/* Conversation List */}
                        <div className="flex-1 overflow-y-auto">
                            {conversations.length > 0 ? (
                                conversations.map((c) => {
                                    const receiver =
                                        c.participants?.find(
                                            (p) => p._id.toString() !== session?.user.id
                                        )
                                    return (
                                        <div
                                            key={c._id.toString()}
                                            className={clsx(
                                                'flex items-center gap-3 p-4 cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-700',
                                                selectedRoom?._id === c._id && 'bg-[#ECECFA] dark:bg-gray-700'
                                            )}
                                            onClick={() => {
                                                setSelectedRoom(c);
                                                router.push(`/chat/${c._id}`);
                                            }}
                                        >
                                            <Image
                                                src={c.group_image || receiver?.image || '/images/default-profile.png'}
                                                alt={c.group_name || receiver?.name || receiver?.username || ""}
                                                className="w-10 h-10 rounded-full object-cover"
                                                height={32} width={32}
                                            />
                                            <div className="flex flex-col">
                                                <p className="font-medium">{c.group_name || receiver?.name || receiver?.username}</p>
                                                <p className="text-sm text-[#636E72] dark:text-gray-400 truncate max-w-[160px]">
                                                    {c.last_message?.text}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                    <MessageCircle size={40} className="text-gray-400 dark:text-gray-500 mb-4" />
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">No conversations yet</p>
                                    <button className="px-4 py-2 bg-[#6C5CE7] hover:bg-[#5b4dd4] text-white rounded-lg transition">
                                        Start New Chat
                                    </button>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Chat Area */}
                    <div className={clsx("flex-1 flex-col", isMobile && !selectedRoom ? 'hidden' : 'flex')}>
                        {children}
                    </div>
                </div>

                {/* Modal for new chat */}
                {showNewChatModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg w-full max-w-md p-6 transition-colors">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Start a New Chat</h2>
                            <input
                                type="text"
                                placeholder="Search user by name or username..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowNewChatModal(false)}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 bg-[#6C5CE7] hover:bg-[#5b4dd4] text-white rounded-lg transition">
                                    Start
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    )
}

export default ChatLayoutClient