import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useRef } from 'react'
import ChatHeader from './header.chat';
import ChatComposer from './composer.chat';
import { IMessage } from '@/models/Message';
import { Session } from 'next-auth';
import { useChatStore } from '@/stores/chatStore';
import MessageSkeleton from '@/components/ui/skeletons/MessageLoading';
import MessageText from './text.chat';
import apiInstance from '@/lib/axios';
import { useUnreadStore } from '@/stores/unreadStore';
import socket from '@/lib/socket/socket';
import TypingLoader from '@/components/ui/loaders/TypingLoader';

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
    const updateLastMessage = useChatStore(state => state.updateChatRoomLastMessage);
    const reorderRooms = useChatStore(state => state.reorderChatRoom);
    const clearUnread = useUnreadStore((s) => s.clear);

    const receiver = activeRoom?.participants.find(participant => participant._id.toString() !== session.user.id);

    // Message states
    const [messages, setMessages] = React.useState<IMessage[]>([]);

    // UI States
    const [loading, setLoading] = React.useState<boolean>(false);
    const [typing, setTyping] = React.useState<boolean>(false);

    // Sort messages
    const orderedMessages = useMemo(
        () => [...messages].reverse(),
        [messages]
    );

    useEffect(() => {
        socket.on("receive-message", ({ roomId, message }) => {
            if (activeRoom?._id.toString() === roomId) {
                setMessages((prev) => [message, ...prev]);
            }
        });

        return () => {
            socket.off("receive-message");
        }
    }, [activeRoom, reorderRooms, updateLastMessage]) // listen for new messages

    // Fetch messages
    useEffect(() => {
        const getMessages = async () => {
            if (activeRoom && !newChat) {
                setLoading(true);
                const messages = (await apiInstance.get(`/api/chat/conversation/${activeRoom._id.toString()}/message`)).data.messages || [];
                setMessages(messages);
            }
            setLoading(false);
        };

        getMessages();
    }, [activeRoom, newChat]);

    // Mark messages as unread
    useEffect(() => {
        const unread = async () => {
            if (activeRoom) {
                clearUnread(activeRoom._id.toString());
                await apiInstance.patch(`/api/conversations/${activeRoom._id.toString()}/mark-read`);
            }
        }

        unread();
    }, [activeRoom, clearUnread]);

    // Scroll to bottom when messages update
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [orderedMessages]);

    // Handle typing
    useEffect(() => {
        socket.on("typing", ({roomId}) => {
            if(activeRoom?._id.toString() === roomId) {
                setTyping(true);
                setTimeout(() => {
                    setTyping(false);
                }, 3000);
            }
        });
    }, [activeRoom?._id])

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
                                                        <MessageText
                                                            key={msg._id.toString()}
                                                            message={msg}
                                                            isMe={isMe}
                                                        />
                                                    );
                                                })}
                                                {typing && <TypingLoader />}
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