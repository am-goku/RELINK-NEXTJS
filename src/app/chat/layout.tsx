'use client'

import Navbar from '@/components/ui/Navbar';
import clsx from 'clsx';
import { MessageCircle, UserPlus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const conversations = [
    { id: 1, name: 'Emily White', lastMessage: 'Hey, how are you?', avatar: '/avatars/emily.png' },
    { id: 2, name: 'Jake Doe', lastMessage: 'Let’s catch up tomorrow!', avatar: '/avatars/jake.png' },
    { id: 3, name: 'Sophia Ray', lastMessage: 'Got the file!', avatar: '/avatars/sophia.png' },
];

type Props = { children: React.ReactNode }

export default function Layout({ children }: Props) {

    const params = useParams();

    const [selectedUser, setSelectedUser] = useState<typeof conversations[0] | null>(null);
    const [showNewChatModal, setShowNewChatModal] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const user = conversations.find((user) => user.id === Number(params.id));
        if (user) {
            setSelectedUser(user);
        }
        console.log(user)
    }, [params])

    return (
        <React.Fragment>
            <div className="flex flex-col min-h-screen">
                <Navbar type='chat' />
                <div className="h-[calc(100vh-80px)] flex bg-[#F0F2F5] text-[#2D3436]">

                    {/* Sidebar */}
                    <aside className={`md:w-72 w-full md:flex flex-col border-r border-gray-200 bg-white shadow-sm ${selectedUser ? 'hidden' : ''}`}>
                        <div className="p-4 border-b text-lg font-semibold flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                                <MessageCircle size={20} /> Messages
                            </div>
                            <button
                                onClick={() => setShowNewChatModal(true)}
                                className="p-1 rounded-full hover:bg-gray-100 transition"
                                title="Start new chat"
                            >
                                <UserPlus size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {conversations.length > 0 ? (
                                conversations.map((user) => (
                                    <div
                                        key={user.id}
                                        className={clsx(
                                            'flex items-center gap-3 p-4 cursor-pointer transition hover:bg-gray-100',
                                            selectedUser?.id === user.id && 'bg-[#ECECFA]'
                                        )}
                                        onClick={() => {
                                            setSelectedUser(user);
                                            router.push(`/chat/${user.id}`);
                                        }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex flex-col">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-[#636E72] truncate max-w-[160px]">
                                                {user.lastMessage}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                    <MessageCircle size={40} className="text-gray-400 mb-4" />
                                    <p className="text-gray-600 mb-4">No conversations yet</p>
                                    <button
                                        onClick={() => setShowNewChatModal(true)}
                                        className="px-4 py-2 bg-[#6C5CE7] text-white rounded-lg hover:bg-[#5b4dd4] transition"
                                    >
                                        Start New Chat
                                    </button>
                                </div>
                            )}
                        </div>
                    </aside>

                    {children}
                </div>

                {/* Modal for new chat */}
                {showNewChatModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                            <h2 className="text-lg font-semibold mb-4">Start a New Chat</h2>
                            <input
                                type="text"
                                placeholder="Search user by name or username..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] mb-4"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowNewChatModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-[#6C5CE7] text-white rounded-lg hover:bg-[#5b4dd4] transition"
                                >
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