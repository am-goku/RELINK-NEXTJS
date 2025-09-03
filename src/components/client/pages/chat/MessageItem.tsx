import { IMessage } from "@/models/Message";
import clsx from "clsx";
import { Types } from "mongoose";
import { Session } from "next-auth";
import { useEffect, useRef } from "react";

function formatTime(date: string | Date) {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

type Props = {
    msg: IMessage;
    isSender: boolean;
    senderName: string;
    receiverId: Types.ObjectId;
    onSeen: (messageId: string) => void;
    session: Session | null;
}

function MessageItem({ msg, isSender, senderName, receiverId, session, onSeen }: Props) {
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
        <div
            ref={msgRef}
            className={clsx(
                'flex flex-col max-w-[85%] sm:max-w-[70%] md:max-w-[60%] group',
                isSender ? 'items-end ml-auto' : 'items-start mr-auto'
            )}
        >
            <span
                className={clsx(
                    'text-[11px] mb-1 font-medium text-gray-500 dark:text-gray-400',
                    isSender ? 'text-right' : 'text-left'
                )}
            >
                {senderName}
            </span>

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
                <span
                    className={clsx(
                        'absolute -bottom-4 text-[10px] font-light text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity',
                        isSender ? 'right-1' : 'left-1'
                    )}
                >
                    {formatTime(msg.created_at)}
                    {/* Seen indicator */}
                    {isSender && msg.read_by?.includes(receiverId) && (
                        <span className="text-xs text-black mt-1">Seen</span>
                    )}
                </span>
            </div>


        </div>
    );
}

export default MessageItem;