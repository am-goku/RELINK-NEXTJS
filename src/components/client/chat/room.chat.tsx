import Avatar from '@/components/ui/avatar'
import socket from '@/lib/socket/socket';
import { IConversationPopulated } from '@/models/Conversation'
import { useUnreadStore } from '@/stores/unreadStore';
import { Types } from 'mongoose';
import React, { useEffect } from 'react'

type Props = {
    room: IConversationPopulated;
    user: {
        _id: Types.ObjectId;
        username: string;
        name?: string;
        image?: string;
    } | undefined;
    activeRoom: IConversationPopulated | null;
    setActiveRoom: (x: IConversationPopulated) => void;
}

function RoomItem({ room, user, activeRoom, setActiveRoom }: Props) {

    const unread = useUnreadStore((s) => s.map[room._id.toString()]);
    const [online, setOnline] = React.useState<boolean>(false);

    useEffect(() => {
        socket.emit("check-online", user?._id.toString(), (isOnline: boolean) => {
            setOnline(isOnline);
        });
    }, [user?._id])

    return (
        <li>
            <button
                onClick={() => setActiveRoom(room)}
                className={`w-full text-left rounded-xl p-2 flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 ${activeRoom?._id.toString() === room._id.toString() ? "bg-light-bg/90 dark:bg-dark-bg/90" : ""}`}
            >
                <div className="relative">
                    {user && <Avatar user={user} key={user?._id.toString()} size={10} />}
                    {/* TODO: Have to manage online status */}
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${online ? "bg-green-500" : "bg-gray-400"}`} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{user?.name || user?.username}</div>
                        {/* Unread message count */}
                        {unread > 0 ? <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[11px]">{unread}</span> : null}
                    </div>
                    <div className="text-xs opacity-70 truncate">{room.last_message?.text}</div>
                </div>
            </button>
        </li>
    )
}

export default RoomItem