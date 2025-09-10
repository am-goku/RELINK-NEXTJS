import { IMessage } from '@/models/Message';
import { sendMessage, startMessage } from '@/services/api/chat-apis';
import { useChatStore } from '@/stores/chatStore';
import { EmojiClickData, Theme } from 'emoji-picker-react';
import { Paperclip, Send, Smile } from 'lucide-react';
import { Session } from 'next-auth';
import dynamic from 'next/dynamic';
import React, { useState } from 'react'

// Dynamically import emoji picker so it only loads on client
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

type Props = {
    newChat?: boolean;
    session: Session;
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
    setNewChat: (x: boolean) => void;
}

function ChatComposer({ newChat, session, setMessages, setNewChat }: Props) {

    const activeRoom = useChatStore(state => state.selectedRoom);
    const addChatRoom = useChatStore(state => state.addChatRoom);
    const setSelectedRoom = useChatStore(state => state.setSelectedRoom);
    const updateLastMessage = useChatStore(state => state.updateChatRoomLastMessage);

    const reorderRooms = useChatStore(state => state.reorderChatRoom);


    const [input, setInput] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    async function handleSendMessage() {
        if (!activeRoom) return;
        if (!input.trim()) return;

        try {
            let newMessage: IMessage | null = null;

            if (activeRoom && !newChat) {
                // send message to a conversation
                newMessage = await sendMessage(activeRoom._id.toString(), input.trim());
            } else if (activeRoom && newChat) {

                const receiver = activeRoom?.participants.find(participant => participant._id.toString() !== session.user.id);

                if (!receiver) throw new Error("Receiver is undefined.");

                // Start a conversation with first message
                const { message, conversation } = await startMessage(receiver._id.toString(), input.trim());
                addChatRoom(conversation);
                setSelectedRoom(conversation);
                setNewChat(false);
                newMessage = message;
            }

            if (newMessage) {
                setMessages((prev) => [newMessage, ...prev]);
                updateLastMessage(activeRoom?._id.toString() as string, newMessage);
                setInput('');

                reorderRooms(activeRoom._id.toString());
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


    return (
        <div className="p-3 border-t bg-white/80 dark:bg-neutral-800/80">
            <div className="max-w-3xl mx-auto flex items-center gap-2">
                <button onClick={() => { }} className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"><Paperclip /></button>

                <div className="flex-1">
                    <input
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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