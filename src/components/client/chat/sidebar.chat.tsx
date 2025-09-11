import { useChatStore } from '@/stores/chatStore';
import { Session } from 'next-auth';
import React, { useEffect } from 'react'
import ChatSearchBar from './search.chat';
import RoomItem from './room.chat';

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
                                <RoomItem key={user?._id.toString()}
                                    room={room}
                                    user={user}
                                    activeRoom={activeRoom}
                                    setActiveRoom={setActiveRoom}
                                />
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </React.Fragment>
    )
}

export default ChatSidebar
