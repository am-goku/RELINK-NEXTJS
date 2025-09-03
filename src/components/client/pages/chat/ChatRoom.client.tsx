'use client'

import ChatHeader from '@/components/client/pages/chat/ChatHeader';
import MessageMapper from '@/components/client/pages/chat/MessageMapper';
import ChatInput from '@/components/ui/fields/ChatInputs';
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
}

function ChatRoomClient({ selectedRoom, receiver, session }: Props) {
    // Message States
    const [messages, setMessages] = useState<IMessage[]>([]);

    // ChatRoonStore States
    const setSelectedRoom = useChatStore((state) => state.setSelectedRoom);
    const room = useChatStore((state) => state.selectedRoom);
    useEffect(() => {
        if (selectedRoom) setSelectedRoom(selectedRoom);
    }, [selectedRoom, setSelectedRoom]);

    // Fetch messages
    const getMessages = useCallback(async () => {
        if (room) {
            const messages = await fetchMessages(room?._id.toString());
            setMessages(messages);
        }
    }, [room]);
    useEffect(() => {
        getMessages();
    }, [getMessages]);

    return (
        <React.Fragment>
            <main className="flex flex-col h-full overflow-hidden">
                {/* Header */}
                <ChatHeader
                    room={room}
                    receiver={receiver} />

                {/* Messages */}
                <MessageMapper
                    receiver={receiver}
                    session={session}
                    room={room}
                    messages={messages} />

                {/* Input */}
                <ChatInput
                    room={room}
                    receiver={receiver}
                    setMessages={setMessages} />
            </main>
        </React.Fragment>
    )
}

export default ChatRoomClient