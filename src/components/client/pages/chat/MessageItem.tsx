import { IMessage } from "@/models/Message";
import clsx from "clsx";
import { Types } from "mongoose";
import { Session } from "next-auth";
import { useEffect, useRef } from "react";
import { motion } from 'framer-motion';

function formatTime(date: string | Date) {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

type Props = {
    msg: IMessage;
    isSender: boolean;
    senderName?: string;
    receiverId: Types.ObjectId;
    onSeen: (messageId: string) => void;
    session: Session | null;
}

function MessageItem({ msg, isSender, receiverId, session, onSeen }: Props) {
    const msgRef = useRef<HTMLDivElement>(null);

    // Run once per message
    useEffect(() => {
        if (!msgRef.current || isSender) return; // Skip for sender
        if (session?.user.id && msg.read_by?.some(id => id.toString() === session?.user.id)) return; // Skip if already seen

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                onSeen(msg._id.toString());
                observer.disconnect();
            }
        }, { threshold: 0.7 });
        observer.observe(msgRef.current);
        return () => observer.disconnect();
    }, [msg._id, isSender, onSeen, msg.read_by, receiverId, session?.user.id]);

    return (
        <motion.div
            ref={msgRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
                'flex flex-col max-w-[85%] sm:max-w-[70%] md:max-w-[60%] group',
                isSender ? 'items-end ml-auto' : 'items-start mr-auto'
            )}
        >
            <div
                className={clsx(
                    'px-4 py-2 rounded-2xl text-sm shadow-md relative w-fit max-w-full',
                    'break-words break-all',
                    isSender
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-sm'
                        : 'bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 rounded-bl-sm'
                )}
            >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                <div className={clsx(
                    'text-[10px] mt-1 opacity-70 text-right select-none',
                    isSender ? 'justify-end' : 'justify-start'
                )}>
                    {
                        formatTime(msg.created_at)}
                    {
                        msg.sender.toString() === session?.user.id
                        && (msg.read_by?.includes(receiverId) ? "✓✓" : "✓")
                    }
                </div>
            </div>
        </motion.div>
    );
}

export default MessageItem;