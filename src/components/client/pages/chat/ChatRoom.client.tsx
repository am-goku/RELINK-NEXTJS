'use client'

import ChatHeader from '@/components/client/pages/chat/ChatHeader';
import MessageMapper from '@/components/client/pages/chat/MessageMapper';
import ChatInput from '@/components/ui/fields/ChatInputs';
import MessageSkeleton from '@/components/ui/skeletons/MessageLoading';
import { IConversationPopulated } from '@/models/Conversation';
import { IMessage } from '@/models/Message';
import { fetchMessages } from '@/services/api/chat-apis';
import { useChatStore } from '@/stores/chatStore';
import { Session } from 'next-auth';
import React, { useCallback, useEffect, useState } from 'react'

type Props = {
    session: Session | null;
    selectedRoom: IConversationPopulated | null;
    receiver: IConversationPopulated['participants'][0];
    newChat: boolean
}

function ChatRoomClient({ selectedRoom, receiver, session, newChat }: Props) {
    // Message States
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // ChatRoonStore States
    const setSelectedRoom = useChatStore((state) => state.setSelectedRoom);
    const room = useChatStore((state) => state.selectedRoom);

    // Initial update of chatrooms for new chat aswell as selected room
    useEffect(() => {
        if (selectedRoom) {
            setSelectedRoom(selectedRoom);
        };
    }, [selectedRoom, setSelectedRoom]);

    // Fetch messages
    const getMessages = useCallback(async () => {
        if (room && !newChat) {
            const messages = await fetchMessages(room?._id.toString());
            setMessages(messages);
        }
        setLoading(false);
    }, [room, newChat]);
    useEffect(() => {
        getMessages();
    }, [getMessages]);

    return (
        <React.Fragment>
            <main className="flex flex-col h-full overflow-hidden">
                {/* Header */}
                <ChatHeader
                    setSelectedRoom={setSelectedRoom}
                    room={room}
                    receiver={receiver} />

                {/* Messages */}
                {
                    loading ? (
                        <MessageSkeleton /> // Loading Skeleton
                    ) : (
                        <MessageMapper
                            receiver={receiver}
                            session={session}
                            room={room}
                            messages={messages} />
                    )
                }

                {/* Input */}
                <ChatInput
                    room={room}
                    receiver={receiver}
                    newChat={newChat}
                    setMessages={setMessages} />
            </main>
        </React.Fragment>
    )
}

export default ChatRoomClient