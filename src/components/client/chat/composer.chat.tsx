import { AnimatePresence, motion } from 'framer-motion'
import { Paperclip, Send, Smile } from 'lucide-react';
import React, { useState } from 'react'

type Message = {
    id: string;
    from: string;
    text?: string;
    image?: string;
    timestamp: string;
    read?: boolean;
};

type Room = {
    id: string;
    participants: string[];
    lastMessage?: string;
    updatedAt?: string;
    unread?: number;
};

type Props = {
    activeRoomId: string | null;
    setMessagesByRoom: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;
    setRooms: React.Dispatch<React.SetStateAction<Room[]>>
}

function ChatComposer({ activeRoomId, setMessagesByRoom, setRooms }: Props) {

const [input, setInput] = useState("");
    const [showImageInput, setShowImageInput] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    function sendMessage() {
        if (!activeRoomId) return;
        if (!input.trim() && !imageUrl.trim()) return;

        const newMsg: Message = {
            id: `m-${Date.now()}`,
            from: "me",
            text: input.trim() || undefined,
            image: imageUrl.trim() || undefined,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: false,
        };

        setMessagesByRoom((prev) => ({ ...prev, [activeRoomId]: [...(prev[activeRoomId] || []), newMsg] }));

        setRooms((prev) => prev.map((r) => (r.id === activeRoomId ? { ...r, lastMessage: newMsg.text || (newMsg.image ? "Sent an image" : ""), updatedAt: new Date().toISOString() } : r)));

        setInput("");
        setImageUrl("");
        setShowImageInput(false);
        setShowEmojiPicker(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function insertEmoji(emoji: string) {
        setInput((s) => s + emoji);
    }

    return (
        <div className="p-3 border-t bg-white/80 dark:bg-neutral-800/80">
            <div className="max-w-3xl mx-auto flex items-center gap-2">
                <button onClick={() => setShowImageInput((s) => !s)} className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"><Paperclip /></button>

                <div className="flex-1">
                    <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write a message..." className="w-full rounded-full border px-4 py-2 text-sm outline-none" />
                    <AnimatePresence>
                        {showImageInput && (
                            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-2 flex gap-2">
                                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (optional)" className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none" />
                                <button onClick={() => sendMessage()} className="px-4 rounded-xl bg-[#2D3436] text-white">Attach</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button onClick={() => setShowEmojiPicker((s) => !s)} className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                            <Smile />
                        </button>
                        {showEmojiPicker && (
                            <div className="absolute bottom-12 left-0 z-50 shadow-lg rounded-xl">
                                {/* <Picker lazyLoadEmojis={true} theme={Theme.DARK} /> */}
                            </div>
                        )}
                    </div>
                    <button onClick={() => sendMessage()} className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"><Send /></button>
                </div>
            </div>
        </div>
    )
}

export default ChatComposer