import apiInstance from '@/lib/axios';
import { IMessage } from '@/models/Message'
import React, { useEffect, useRef } from 'react'


function formatTime(date: string | Date) {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

type Props = {
    message: IMessage;
    isMe: boolean;
}

function MessageText({ message, isMe }: Props) {

    const msgRef = useRef<HTMLDivElement | null>(null);

    const markRead = React.useCallback(async () => {
        await apiInstance.patch(`/api/chat/conversation/${message.conversation_id}/message/${message._id}/seen`);
    }, [message.conversation_id, message._id]);

    useEffect(() => {
        if (!msgRef.current || isMe) return; // usually we don't "read" our own messages

        const node = msgRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Trigger event once exposed
                        markRead();

                        // stop observing after first trigger
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.6 } // 👈 60% visible
        );

        if (node) {
            observer.observe(node);
        }

        return () => {
            if (node) {
                observer.unobserve(node);
            }
        };
    }, [message, isMe, markRead]);

    return (
        <React.Fragment>
            <div ref={msgRef} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-2xl p-3 shadow-sm max-w-[82%] ${isMe ? "bg-[#2D3436] text-white" : "bg-white dark:bg-neutral-800 text-[#2D3436]"}`}>
                    {message.text && <div className="whitespace-pre-wrap">{message.text}</div>}
                    {/* TODO: Attach image */}
                    {/* {message.image && <img src={message.image} alt="attached" className="mt-2 rounded-md object-cover max-h-72" />} */}
                    <div className="text-[11px] mt-2 opacity-60 text-right">{formatTime(message.created_at)}</div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default MessageText