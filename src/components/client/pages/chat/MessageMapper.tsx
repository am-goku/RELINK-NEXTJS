import { IConversationPopulated } from '@/models/Conversation';
import { IMessage } from '@/models/Message';
import { Session } from 'next-auth';
import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import MessageItem from './MessageItem';
import { markSeen } from '@/services/api/chat-apis';
import EmptyChatState from '@/components/error/EmptyChatState';

type Props = {
    messages: IMessage[];
    receiver: IConversationPopulated['participants'][0];
    session: Session | null;
    room: IConversationPopulated | null;
};

function MessageMapper({ messages, receiver, session, room }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);

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
                    orderedMessages.map((msg) => {
                        const isSender = msg.sender.toString() === session?.user?.id;
                        const senderName = isSender ? 'You' : receiver.username;

                        return (
                            <MessageItem
                                key={msg._id.toString()}
                                msg={msg}
                                isSender={isSender}
                                senderName={senderName}
                                receiverId={receiver._id}
                                onSeen={handleSeen}
                                session={session}
                            />
                        );
                    })
                ) : (
                    <EmptyChatState />
                )
            }

            {/* Scroll anchor */}
            <div ref={bottomRef} />
        </div>
    );
}

export default MessageMapper;


