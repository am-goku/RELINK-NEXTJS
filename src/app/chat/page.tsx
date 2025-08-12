'use client';

import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import clsx from 'clsx';
import Navbar from '../../components/ui/Navbar';

const conversations = [
    { id: 1, name: 'Emily White', lastMessage: 'Hey, how are you?', avatar: '/avatars/emily.png' },
    { id: 2, name: 'Jake Doe', lastMessage: 'Let’s catch up tomorrow!', avatar: '/avatars/jake.png' },
    { id: 3, name: 'Sophia Ray', lastMessage: 'Got the file!', avatar: '/avatars/sophia.png' },
];

const messages = [
    { id: 1, fromMe: false, text: 'Hey! How’s it going?' },
    { id: 2, fromMe: true, text: 'All good! What about you?' },
    { id: 3, fromMe: false, text: 'Pretty great, just busy with work.' },
];

export default function ChatPage() {
    const [selectedUser, setSelectedUser] = useState(conversations[0]);
    const [input, setInput] = useState('');

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar type='chat' />
            <div className="h-[calc(100vh-80px)] flex bg-[#F0F2F5] text-[#2D3436]">

                {/* Sidebar */}
                <aside className="w-72 hidden md:flex flex-col border-r border-gray-200 bg-white shadow-sm">
                    <div className="p-4 border-b text-lg font-semibold flex items-center gap-2">
                        <MessageCircle size={20} /> Messages
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((user) => (
                            <div
                                key={user.id}
                                className={clsx(
                                    'flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 transition',
                                    user.id === selectedUser.id && 'bg-[#ECECFA]'
                                )}
                                onClick={() => setSelectedUser(user)}
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
                        ))}
                    </div>
                </aside>

                {/* Chat Window */}
                <main className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 bg-white border-b shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={selectedUser.avatar}
                            alt={selectedUser.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-medium">{selectedUser.name}</p>
                            <p className="text-sm text-[#636E72]">Online</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-[#F8F9FA]">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={clsx(
                                    'max-w-sm px-4 py-2 rounded-xl text-sm',
                                    msg.fromMe
                                        ? 'ml-auto bg-[#6C5CE7] text-white'
                                        : 'mr-auto bg-white border'
                                )}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t flex items-center gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2 text-sm rounded-full border focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                        />
                        <button className="text-[#6C5CE7] p-2 hover:text-opacity-80 transition">
                            <Send size={20} />
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
