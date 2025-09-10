import { IConversationPopulated } from '@/models/Conversation';
import { useChatStore } from '@/stores/chatStore';
import { ArrowLeft, ImageIcon, MoreHorizontal } from 'lucide-react'
import React from 'react'

type Props = {
    receiver: IConversationPopulated['participants'][0];
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setNewChat: (x: boolean) => void
}

function ChatHeader({ receiver, setSidebarOpen, setNewChat }: Props) {

    const setActiveRoom = useChatStore(state => state.setSelectedRoom);

    return (
        <div className="flex items-center gap-3 p-4 border-b bg-white/70 dark:bg-neutral-800/70 dark:border-gray-700 sticky top-0 z-10">
            <div className="md:hidden">
                <button
                    onClick={() => {
                        setSidebarOpen(true);
                        setNewChat(false);
                        setActiveRoom(null);
                    }}
                    className="p-2 rounded-md"><ArrowLeft /></button>
            </div>
            {receiver ? (
                <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={receiver.image || '/images/default-profile.png'} alt="img" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                        <div className="font-semibold">{receiver.name}</div>
                        {/* TODO: show last seen */}
                        {/* <div className="text-xs opacity-70">{participantUser.online ? "Online" : "Offline"}</div> */}
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"><ImageIcon /></button>
                        <button className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"><MoreHorizontal /></button>
                    </div>
                </>
            ) : (
                <div className="flex-1 text-center text-sm opacity-70">Select a conversation or start a new chat</div>
            )}
        </div>
    )
}

export default ChatHeader