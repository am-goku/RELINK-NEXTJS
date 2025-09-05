import { IConversationPopulated } from '@/models/Conversation';
import { IMessage } from '@/models/Message';
import { Session } from 'next-auth';
import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import MessageItem from './MessageItem';
import { markSeen } from '@/services/api/chat-apis';
import EmptyChatState from '@/components/error/EmptyChatState';
import clsx from 'clsx';

type Props = {
    messages: IMessage[];
    receiver: IConversationPopulated['participants'][0];
    session: Session | null;
    room: IConversationPopulated | null;
};

function MessageMapper({ messages, receiver, session, room }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);

    // UI States
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isTyping, setIsTyping] = useState<boolean>(false);
    // TODO: Add typing indicator

    const orderedMessages = useMemo(
        () => [...messages].reverse(),
        [messages]
    );

    // Scroll to bottom when messages update
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [orderedMessages]);

    // ✅ API call to mark as seen
    const handleSeen = useCallback(async (messageId: string) => {
        try {
            if (room && room._id) {
                await markSeen(room._id.toString(), messageId);
                // Optionally: update local state here if needed
            } else {
                console.warn("Cannot mark message as seen: room or room._id is undefined");
            }
        } catch (err) {
            console.error("Failed to mark message as seen", err);
        }
    }, [room]);

    return (
        <div
            className="flex flex-col h-full overflow-auto px-4 py-6 space-y-4 bg-light-bg dark:bg-dark-bg transition-colors scrollbar-none"
        >
            {
                messages.length > 0 ? (
                    orderedMessages.map((msg, idx) => {
                        const isSender = msg.sender.toString() === session?.user?.id;
                        const senderName = isSender ? 'You' : receiver.username;

                        return (
                            <React.Fragment key={msg._id.toString() + idx + senderName}>

                                {/* Divider */}
                                {
                                    msg.sender.toString() !== orderedMessages[idx - 1]?.sender.toString() && (
                                        <span
                                            className={clsx(
                                                'text-[11px] mb-1 font-medium text-gray-500 dark:text-gray-400',
                                                isSender ? 'text-right' : 'text-left'
                                            )}
                                        >
                                            {senderName}
                                        </span>
                                    )
                                }

                                {/* Message Item Section */}
                                <MessageItem
                                    key={msg._id.toString()}
                                    msg={msg}
                                    isSender={isSender}
                                    senderName={senderName}
                                    receiverId={receiver._id}
                                    onSeen={handleSeen}
                                    session={session}
                                />
                            </React.Fragment>
                        );
                    })
                ) : (
                    <EmptyChatState />
                )
            }

            {isTyping && (
                <div className="text-sm italic text-gray-500">{receiver?.username} is typing...</div>
            )}

            {/* Scroll anchor */}
            <div ref={bottomRef} />
        </div>
    );
}

export default MessageMapper;


