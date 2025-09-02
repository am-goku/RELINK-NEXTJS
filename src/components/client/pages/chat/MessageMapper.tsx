import { IConversationPopulated } from '@/models/Conversation';
import { IMessage } from '@/models/Message';
import clsx from 'clsx';
import { Session } from 'next-auth';
import React, { useEffect, useRef } from 'react';

// Utility to format timestamps nicely
function formatTime(date: string | Date) {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

type Props = {
    messages: IMessage[];
    receiver: IConversationPopulated['participants'][0];
    session: Session | null;
};

function MessageMapper({ messages, receiver, session }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Since latest messages are at index 0, reverse them to render in chronological order
    const orderedMessages = [...messages].reverse();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [orderedMessages]);

    return (
        <div
            ref={scrollRef}
            className="flex flex-col h-full overflow-auto px-4 py-6 space-y-4 bg-light-bg dark:bg-dark-bg transition-colors scrollbar-none"
        >
            {orderedMessages.map((msg) => {
                const isSender = msg.sender.toString() === session?.user?.id.toString();
                const senderName = isSender ? 'You' : receiver.username;

                return (
                    <div
                        key={msg._id.toString()}
                        className={clsx(
                            'flex flex-col max-w-[85%] sm:max-w-[70%] md:max-w-[60%] group',
                            isSender ? 'items-end ml-auto' : 'items-start mr-auto'
                        )}
                    >
                        {/* Sender Name */}
                        <span
                            className={clsx(
                                'text-[11px] mb-1 font-medium text-gray-500 dark:text-gray-400',
                                isSender ? 'text-right' : 'text-left'
                            )}
                        >
                            {senderName}
                        </span>

                        {/* Message bubble */}
                        <div
                            className={clsx(
                                'px-4 py-2 rounded-2xl text-sm shadow-md relative w-fit max-w-full',
                                'break-words break-all',
                                isSender
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-sm'
                                    : 'bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 rounded-bl-sm'
                            )}
                        >
                            {/* Message text */}
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                            {/* Timestamp */}
                            <span
                                className={clsx(
                                    'absolute -bottom-4 text-[10px] font-light text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity',
                                    isSender ? 'right-1' : 'left-1'
                                )}
                            >
                                {formatTime(msg.created_at)}
                            </span>
                        </div>
                    </div>
                );
            })}

            <div ref={scrollRef} />
        </div>
    );
}

export default MessageMapper;
