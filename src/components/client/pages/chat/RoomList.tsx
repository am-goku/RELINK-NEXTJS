import { IConversationPopulated } from '@/models/Conversation';
import clsx from 'clsx';
import { MessageCircle } from 'lucide-react';
import { Session } from 'next-auth'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'

type Props = {
    session: Session | null;
    chatRooms: IConversationPopulated[];
    selectedRoom: IConversationPopulated | null;
    setSelectedRoom: (room: IConversationPopulated) => void;
    loading: boolean;
}

function RoomList({ chatRooms, selectedRoom, session, setSelectedRoom, loading }: Props) {

    const router = useRouter();

    return (
        <React.Fragment>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    // Skeleton Loader
                    <div className="space-y-2 p-4 animate-pulse">
                        {[...Array(6)].map((_, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : chatRooms.length > 0 ? (
                    chatRooms.map((c) => {
                        const receiver =
                            c.participants?.find(
                                (p) => p._id.toString() !== session?.user.id
                            );
                        return (
                            <div
                                key={c._id.toString()}
                                className={clsx(
                                    'flex items-center gap-3 p-4 cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-700',
                                    selectedRoom?._id === c._id && 'bg-[#ECECFA] dark:bg-gray-700'
                                )}
                                onClick={() => {
                                    setSelectedRoom(c);
                                    router.push(`/chat/${c._id}`);
                                }}
                            >
                                <Image
                                    src={c.group_image || receiver?.image || '/images/default-profile.png'}
                                    alt={c.group_name || receiver?.name || receiver?.username || ""}
                                    className="w-10 h-10 rounded-full object-cover"
                                    height={32} width={32}
                                />
                                <div className="flex flex-col">
                                    <p className="font-medium">{c.group_name || receiver?.name || receiver?.username}</p>
                                    <p className="text-sm text-[#636E72] dark:text-gray-400 truncate max-w-[160px]">
                                        {c.last_message?.text}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <MessageCircle size={40} className="text-gray-400 dark:text-gray-500 mb-4" />
                        <p className="text-gray-600 dark:text-gray-300 mb-4">No chatRooms yet</p>
                        <button className="px-4 py-2 bg-[#6C5CE7] hover:bg-[#5b4dd4] text-white rounded-lg transition">
                            Start New Chat
                        </button>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}

export default RoomList