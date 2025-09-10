import { ArrowLeft, ImageIcon, MoreHorizontal } from 'lucide-react'
import React from 'react'

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    participantUser: any;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatHeader({ participantUser, setSidebarOpen }: Props) {
    return (
        <div className="flex items-center gap-3 p-4 border-b bg-white/70 dark:bg-neutral-800/70 dark:border-gray-700 sticky top-0 z-10">
            <div className="md:hidden">
                <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md"><ArrowLeft /></button>
            </div>
            {participantUser ? (
                <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={participantUser.avatar} alt="img" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                        <div className="font-semibold">{participantUser.name}</div>
                        <div className="text-xs opacity-70">{participantUser.online ? "Online" : "Offline"}</div>
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