import { IMessage } from '@/models/Message'
import React, { useRef } from 'react'


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

    return (
        <React.Fragment>
            <div ref={msgRef} key={message._id.toString()} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
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