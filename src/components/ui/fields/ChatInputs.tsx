'use client'

import { IConversationPopulated } from '@/models/Conversation'
import { IMessage } from '@/models/Message';
import { sendMessage, startMessage } from '@/services/api/chat-apis';
import { ImageIcon, Send, Smile } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useCallback } from 'react'
import TextareaAutosize from 'react-textarea-autosize';

type Props = {
    room: IConversationPopulated | null;
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
    receiver: IConversationPopulated['participants'][0];
}

function ChatInput({ room, setMessages, receiver }: Props) {

    // Message content state
    const [content, setContent] = React.useState<string>('');

    // Handle send message or Start conversation
    const handleSendMessage = useCallback(async () => {
        if (!content.trim()) return;

        try {
            let newMessage: IMessage | null = null;

            if (room) {
                // send message to a conversation
                newMessage = await sendMessage(room._id.toString(), content);
            } else if (receiver) {
                // Start a conversation with first message
                const { message } = await startMessage(receiver._id.toString(), content);
                newMessage = message;
            }

            if (newMessage) {
                setMessages((prev) => [newMessage, ...prev]);
                setContent('');
            }
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    }, [content, room, receiver, setMessages]);


    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Handle the file upload logic here
            console.log('File uploaded:', file);
        }
    };

    return (
        <React.Fragment>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white dark:bg-neutral-800 border-t dark:border-neutral-700 flex items-center gap-2 sticky bottom-0 transition-colors w-full"
            >
                {/* Emoji button */}
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition">
                    <Smile size={20} />
                </button>


                {/* File upload */}
                <label className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition">
                    <ImageIcon size={20} />
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>


                {/* Textarea for multi-line input */}
                <TextareaAutosize
                    minRows={1}
                    maxRows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your message..."
                    maxLength={1500}
                    className="flex-1 px-4 py-2 text-sm rounded-md border dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] resize-none transition-colors"
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                            setContent('');
                        }
                    }}
                />


                {/* Send button */}
                <button onClick={() => { handleSendMessage(); setContent(''); }} className="text-[#6C5CE7] p-2 hover:text-opacity-80 transition flex-shrink-0">
                    <Send size={20} />
                </button>
            </motion.div>
        </React.Fragment>
    )
}

export default ChatInput