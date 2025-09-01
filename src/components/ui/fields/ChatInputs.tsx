import { IConversationPopulated } from '@/models/Conversation'
import { IMessage } from '@/models/Message';
import { sendMessage, startMessage } from '@/services/api/chat-apis';
import { Send } from 'lucide-react';
import React, { useCallback } from 'react'

type Props = {
    room: IConversationPopulated | null;
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
    receiver: IConversationPopulated['participants'][0];
}

function ChatInput({ room, setMessages, receiver }: Props) {

    // Message content state
    const [content, setContent] = React.useState<string>('');

    // Handle send message or Start conversation
    const handleSendMessage = useCallback(async () => {
        if (!content.trim()) return;

        try {
            let newMessage: IMessage | null = null;

            if (room) {
                // send message to a conversation
                newMessage = await sendMessage(room._id.toString(), content);
            } else if (receiver) {
                // Start a conversation with first message
                const { message } = await startMessage(receiver._id.toString(), content);
                newMessage = message;
            }

            if (newMessage) {
                setMessages((prev) => [...prev, newMessage]);
                setContent('');
            }
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    }, [content, room, receiver, setMessages]);

    return (
        <React.Fragment>
            <div className="p-4 bg-white dark:bg-neutral-800 border-t dark:border-neutral-700 flex items-center gap-2 sticky bottom-0 transition-colors">
                <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 text-sm rounded-full border dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-colors"
                />
                <button onClick={handleSendMessage} className="text-[#6C5CE7] p-2 hover:text-opacity-80 transition flex-shrink-0">
                    <Send size={20} />
                </button>
            </div>
        </React.Fragment>
    )
}

export default ChatInput