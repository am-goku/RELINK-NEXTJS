'use client'

import ChatHeader from '@/components/client/pages/chat/ChatHeader';
import { IConversationPopulated } from '@/models/Conversation';
import { IMessage } from '@/models/Message';
import { fetchMessages, fetchSelectedConversation } from '@/services/api/chat-apis';
import clsx from 'clsx';
import { Send } from 'lucide-react'
import { useSession } from 'next-auth/react';
import { notFound, useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'

function Page() {
    const params = useParams()
    const [input, setInput] = useState('');

    const {data: session} = useSession();
    
    // Conversation States
    const [selectedRoom, setSelectedRoom] = useState<IConversationPopulated | null>(null);

    // Message States
    const [messages, setMessages] = useState<IMessage[]>([]);

    //Fetch selected room details
    const fetchRoomDetails = useCallback(async () => {
        if (params?.roomId) {
            try {
                const conversation = await fetchSelectedConversation(params.roomId.toString());
                setSelectedRoom(conversation);
            } catch (error) {
                console.error("Error fetching room details:", error);
                notFound();
            }
        }
    }, [params.roomId]);
    useEffect(() => {
        fetchRoomDetails();
    }, [fetchRoomDetails]);

    // Fetch messages
    const getMessages = useCallback(async () => {
        if (selectedRoom) {
            const messages = await fetchMessages(selectedRoom?._id.toString());
            setMessages(messages);
        }
    }, [selectedRoom]);
    useEffect(() => {
        getMessages();
    }, [getMessages]);

    return (
        <React.Fragment>
            <main className="flex-1 flex flex-col h-screen">
                {/* Header */}
                <ChatHeader selectedUser={selectedRoom} />

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-[#F8F9FA] dark:bg-neutral-900 transition-colors">
                    {messages.map((msg) => (
                        <div
                            key={msg._id.toString()}
                            className={clsx(
                                'max-w-[80%] sm:max-w-sm px-4 py-2 rounded-xl text-sm break-words transition-colors',
                                msg.sender.toString() === session?.user.id
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