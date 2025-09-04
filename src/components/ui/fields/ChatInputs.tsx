'use client';

import { motion } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import { Smile, Image as ImageIcon, Send } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { EmojiClickData, Theme } from 'emoji-picker-react';
import { IConversationPopulated } from '@/models/Conversation';
import { IMessage } from '@/models/Message';
import { sendMessage, startMessage } from '@/services/api/chat-apis';
import { useChatStore } from '@/stores/chatStore';

// Dynamically import emoji picker so it only loads on client
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

type Prop = {
    room: IConversationPopulated | null;
    receiver: IConversationPopulated['participants'][0] | null;
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
    newChat: boolean;
}

export default function ChatInput({ receiver, room, setMessages, newChat }: Prop) {
    // Emoji Picker State Reference
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Message States
    const [content, setContent] = useState<string>('');

    //ChatRoonStore States
    const updateLastMessage = useChatStore((state) => state.updateChatRoomLastMessage);
    const addChatRoom = useChatStore((state) => state.addChatRoom);
    const setSelectedRoom = useChatStore((state) => state.setSelectedRoom);

    const onEmojiClick = (emojiObject: EmojiClickData) => {
        setContent((prev) => prev + emojiObject.emoji);
    };

    const handleSendMessage = useCallback(async () => {
        if (!content.trim()) return;

        try {
            let newMessage: IMessage | null = null;

            if (room && !newChat) {
                // send message to a conversation
                newMessage = await sendMessage(room._id.toString(), content);
            } else if (receiver && newChat) {
                // Start a conversation with first message
                const { message, conversation } = await startMessage(receiver._id.toString(), content);
                addChatRoom(conversation);
                setSelectedRoom(conversation);
                newMessage = message;
            }

            if (newMessage) {
                setMessages((prev) => [newMessage, ...prev]);
                updateLastMessage(room?._id.toString() as string, newMessage);
                setContent('');
            }
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    }, [content, room, newChat, receiver, addChatRoom, setSelectedRoom, setMessages, updateLastMessage]);

    // TODO: Handle file upload is not managed
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // handle file upload here
            console.log(file);
        }
    };

    // EMOJI UI EFFETCT
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white dark:bg-neutral-800 border-t dark:border-neutral-700 flex items-end gap-2 sticky bottom-0 w-full transition-colors"
        >
            {/* Emoji toggle button */}
            <div className="relative">
                <button
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                >
                    <Smile size={20} />
                </button>
                {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-12 left-0 z-50 shadow-lg rounded-xl">
                        <Picker lazyLoadEmojis={true} onEmojiClick={(data) => onEmojiClick(data)} theme={Theme.DARK} />
                    </div>
                )}
            </div>

            {/* File upload */}
            <label className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition">
                <ImageIcon size={20} />
                <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Textarea */}
            <TextareaAutosize
                minRows={1}
                maxRows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message..."
                maxLength={1500}
                className="flex-1 px-4 py-2 text-sm rounded-lg border dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] resize-none transition-colors"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                        setContent('');
                    }
                }}
            />

            {/* Send button */}
            <button
                onClick={() => {
                    handleSendMessage();
                    setContent('');
                }}
                disabled={!content.trim()}
                className="text-[#6C5CE7] p-2 hover:text-opacity-80 transition flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <Send size={20} />
            </button>
        </motion.div>
    );
}
