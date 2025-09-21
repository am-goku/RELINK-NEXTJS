import apiInstance from '@/lib/axios';
import socket from '@/lib/socket/socket';
import { IMessage } from '@/models/Message';
import { useChatStore } from '@/stores/chatStore';
import { EmojiClickData, Theme } from 'emoji-picker-react';
import { Paperclip, Send, Smile } from 'lucide-react';
import { Session } from 'next-auth';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react'

// Dynamically import emoji picker so it only loads on client
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

type Props = {
    newChat?: boolean;
    session: Session;
    setNewChat: (x: boolean) => void;
}

function ChatComposer({ newChat, session, setNewChat }: Props) {

    const activeRoom = useChatStore(state => state.selectedRoom);
    const addChatRoom = useChatStore(state => state.addChatRoom);
    const setSelectedRoom = useChatStore(state => state.setSelectedRoom);

    const [input, setInput] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const sendTyping = () => {
        socket.emit("typing", { roomId: activeRoom?._id.toString() });
    }

    async function handleSendMessage() {
        if (!activeRoom) return;
        if (!input.trim()) return;

        try {
            let newMessage: IMessage | null = null;

            if (activeRoom && !newChat) {
                // send message to a conversation
                newMessage = (await apiInstance.post(`/api/chat/conversation/${activeRoom._id.toString()}/message`, { content: input.trim() })).data.messageData;

            } else if (activeRoom && newChat) {

                const receiver = activeRoom?.participants.find(participant => participant._id.toString() !== session.user.id);

                if (!receiver) throw new Error("Receiver is undefined.");

                // Start a conversation with first message
                const { messageData: message, conversation } = (await apiInstance.post(`/api/chat/${receiver._id.toString()}`, { content: input.trim() })).data;
                addChatRoom(conversation);
                setSelectedRoom(conversation);
                setNewChat(false);
                newMessage = message;
            }

            if (newMessage) {
                setInput('');
                socket.emit("send-message", { roomId: activeRoom._id.toString(), message: newMessage });
            }
        } catch (err) {
            console.error("Failed to send message:", err);
        }

        setInput("");
        setShowEmojiPicker(false);
    }

    const onEmojiClick = (emojiObject: EmojiClickData) => {
        setInput((prev) => prev + emojiObject.emoji);
    };

    useEffect(() => {
        return () => {
            setShowEmojiPicker(false);
            setInput("");
        }
    }, [activeRoom])

    return (
        <div className="p-3 border-t bg-white/80 dark:bg-neutral-800/80">
            <div className="max-w-3xl mx-auto flex items-center gap-2">
                <button onClick={() => { }} className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"><Paperclip /></button>

                <div className="flex-1">
                    <input
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSendMessage();
                            }

                            if (e.key === "Escape") {
                                setShowEmojiPicker(false);
                            }

                            sendTyping();
                        }}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Write a message..."
                        className="w-full rounded-full border px-4 py-2 text-sm outline-none" />
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button onClick={() => setShowEmojiPicker((s) => !s)} className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                            <Smile />
                        </button>
                        {showEmojiPicker && (
                            <div className="absolute bottom-12 left-0 z-50 shadow-lg rounded-xl">
                                <Picker lazyLoadEmojis={true} theme={Theme.AUTO} onEmojiClick={(data) => onEmojiClick(data)} />
                            </div>
                        )}
                    </div>
                    <button onClick={() => handleSendMessage()} className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"><Send /></button>
                </div>
            </div>
        </div>
    )
}

export default ChatComposer