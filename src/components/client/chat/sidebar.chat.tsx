import Avatar from '@/components/ui/avatar';
import { useChatStore } from '@/stores/chatStore';
import { Session } from 'next-auth';
import React, { useEffect } from 'react'
import ChatSearchBar from './search.chat';

type Props = {
    session: Session;
    sidebarOpen: boolean;
    minScreen: boolean;
    setNewChat: (x: boolean) => void;
}

function ChatSidebar({ session, sidebarOpen, minScreen, setNewChat }: Props) {

    const rooms = useChatStore(state => state.chatRooms);
    const activeRoom = useChatStore(state => state.selectedRoom);
    const setActiveRoom = useChatStore(state => state.setSelectedRoom);

    useEffect(() => {
        return () => setActiveRoom(null)
    }, [setActiveRoom])

    return (
        <React.Fragment>
            <aside className={`flex-shrink-0 w-full md:w-80 border-r border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-neutral-800/70 transition-transform ${(sidebarOpen) ? "translate-x-0 block h-full" : (!sidebarOpen && minScreen) ? "-translate-x-full md:translate-x-0 hidden" : ""}`}>
                {/* TODO: Search Bar Area */}
                <ChatSearchBar
                    setActiveRoom={setActiveRoom}
                    session={session}
                    rooms={rooms}
                    setNewChat={setNewChat} />

                {/* Chat Room List */}
                <nav className="p-3 overflow-auto max-h-[calc(100vh-200px)]">
                    <ul className="space-y-2">
                        {rooms.map((room) => {
                            const user = room.participants.find(p => p._id.toString() !== session.user.id);
                            return (
                                <li key={room._id.toString()}>
                                    <button
                                        onClick={() => setActiveRoom(room)}
                                        className={`w-full text-left rounded-xl p-2 flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 ${activeRoom?._id.toString() === room._id.toString() ? "bg-light-bg/90 dark:bg-dark-bg/90" : ""}`}
                                    >
                                        <div className="relative">
                                            {user && <Avatar user={user} key={user?._id.toString()} size={10} />}
                                            {/* TODO: Have to manage online status */}
                                            {/* <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user?.online ? "bg-green-500" : "bg-gray-400"}`} /> */}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="font-medium text-sm">{user?.name || user?.username}</div>
                                                {room.last_message ? <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[11px]">{2}</span> : null}
                                            </div>
                                            <div className="text-xs opacity-70 truncate">{room.last_message?.text}</div>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </React.Fragment>
    )
}

export default ChatSidebar
