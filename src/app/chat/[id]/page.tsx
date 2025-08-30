'use client'

import clsx from 'clsx';
import { ArrowLeft, Send } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const conversations = [
    { id: 1, name: 'Emily White', lastMessage: 'Hey, how are you?', avatar: '/images/default-profile.png' },
    { id: 2, name: 'Jake Doe', lastMessage: 'Let’s catch up tomorrow!', avatar: '/images/default-profile.png' },
    { id: 3, name: 'Sophia Ray', lastMessage: 'Got the file!', avatar: '/images/default-profile.png' },
];

const messages = [
    { id: 1, fromMe: false, text: 'Hey! How’s it going?' },
    { id: 2, fromMe: true, text: 'All good! What about you?' },
    { id: 3, fromMe: false, text: 'Pretty great, just busy with work.' },
];

function Page() {
    const params = useParams()
    const router = useRouter();
    const [selectedUser, setSelectedUser] = useState<typeof conversations[0] | null>(null);
    const [input, setInput] = useState('');

    useEffect(() => {
        const user = conversations.find((user) => user.id === Number(params.id));
        if (user) {
            setSelectedUser(user);
        } else {
            router.push('/chat');
        }
    }, [params, router])

    return (
        <React.Fragment>
            <main className="flex-1 flex flex-col h-screen">
                {/* Header */}
                <div className="p-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-800">
                    <button
                        onClick={() => router.back()}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={selectedUser?.avatar}
                            alt={selectedUser?.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium">{selectedUser?.name}</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-[#F8F9FA] dark:bg-neutral-900 transition-colors">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={clsx(
                                'max-w-[80%] sm:max-w-sm px-4 py-2 rounded-xl text-sm break-words transition-colors',
                                msg.fromMe
                                    ? 'ml-auto bg-[#6C5CE7] text-white'
                                    : 'mr-auto bg-white dark:bg-neutral-800 dark:border-neutral-700 border'
                            )}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-neutral-800 border-t dark:border-neutral-700 flex items-center gap-2 sticky bottom-0 transition-colors">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 text-sm rounded-full border dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-colors"
                    />
                    <button className="text-[#6C5CE7] p-2 hover:text-opacity-80 transition flex-shrink-0">
                        <Send size={20} />
                    </button>
                </div>
            </main>
        </React.Fragment>
    )
}

export default Page