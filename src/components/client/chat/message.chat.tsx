import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import ChatHeader from './header.chat';
import ChatComposer from './composer.chat';
import { IMessage } from '@/models/Message';
import { Session } from 'next-auth';
import { useChatStore } from '@/stores/chatStore';
import { fetchMessages } from '@/services/api/chat-apis';
import MessageSkeleton from '@/components/ui/skeletons/MessageLoading';

function formatTime(date: string | Date) {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

type Props = {
    session: Session;
    sidebarOpen: boolean;
    minScreen: boolean;
    newChat: boolean;
    setNewChat: (x: boolean) => void;

    //Fun
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


function MessageArea({ session, minScreen, sidebarOpen, newChat, setSidebarOpen, setNewChat }: Props) {

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Chat room states
    const activeRoom = useChatStore(state => state.selectedRoom);
    const receiver = activeRoom?.participants.find(participant => participant._id.toString() !== session.user.id);

    const [messages, setMessages] = React.useState<IMessage[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    // Fetch messages
    const getMessages = useCallback(async () => {
        if (activeRoom && !newChat) {
            setLoading(true);
            const messages = await fetchMessages(activeRoom?._id.toString());
            setMessages(messages);
        }
        setLoading(false);
    }, [activeRoom, newChat]);
    useEffect(() => {
        getMessages();
    }, [getMessages]);

    const orderedMessages = useMemo(
        () => [...messages].reverse(),
        [messages]
    );

    // Scroll to bottom when messages update
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [orderedMessages]);


    return (
        <React.Fragment>
            <main className={`flex-1 flex overflow-hidden flex-col ${(sidebarOpen && minScreen) && "hidden"}`}>
                {
                    activeRoom ? (

                        <React.Fragment>
                            {/* Chat Header */}
                            {receiver && (
                                <ChatHeader
                                    receiver={receiver}
                                    setSidebarOpen={setSidebarOpen}
                                    setNewChat={setNewChat}
                                />
                            )}

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-2 bg-[#F8F9FB] dark:bg-neutral-900/50">
                                {
                                    loading ? (
                                        <MessageLoader />
                                    ) : (
                                        <AnimatePresence mode="wait">
                                            <motion.div key={activeRoom?._id.toString()} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 max-w-3xl mx-auto">
                                                {orderedMessages.map((msg) => {
                                                    const isMe = msg.sender.toString() === session.user.id;
                                                    return (
                                                        <div key={msg._id.toString()} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                                            <div className={`rounded-2xl p-3 shadow-sm max-w-[82%] ${isMe ? "bg-[#2D3436] text-white" : "bg-white dark:bg-neutral-800 text-[#2D3436]"}`}>
                                                                {msg.text && <div className="whitespace-pre-wrap">{msg.text}</div>}
                                                                {/* TODO: Attach image */}
                                                                {/* {msg.image && <img src={msg.image} alt="attached" className="mt-2 rounded-md object-cover max-h-72" />} */}
                                                                <div className="text-[11px] mt-2 opacity-60 text-right">{formatTime(msg.created_at)}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <div ref={messagesEndRef} />
                                            </motion.div>
                                        </AnimatePresence>
                                    )
                                }

                                <div ref={bottomRef} />
                            </div>

                            {/* Composer */}
                            <ChatComposer
                                newChat={newChat}
                                session={session}
                                setNewChat={setNewChat}
                                setMessages={setMessages}
                            />

                        </React.Fragment>
                    ) : (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm opacity-70 mt-12">No conversation selected</motion.div>
                    )
                }
            </main >
        </React.Fragment >
    )
}

export default MessageArea


const MessageLoader = () => {
    return (
        <AnimatePresence mode="wait">
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 max-w-3xl mx-auto">
                <div className="space-y-4 max-w-3xl mx-auto">
                    <MessageSkeleton />
                </div>
            </motion.div>
        </AnimatePresence>
    )
}