import { fecthMutualConnections } from "@/services/api/user-apis";
import { Loader2, MessageCircle, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { hasParticipantInNonGroup } from '@/helpers/chat-helper'
import { IConversationPopulated } from "@/models/Conversation";

type Props = {
    conversations: IConversationPopulated[]
}

function ChatListheader({ conversations }: Props) {

    // Navigation
    const router = useRouter();

    // Search state
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<{
        _id: string,
        name: string,
        image: string,
        username: string
    }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Connection fetch
    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null; // Initializing timeout variable

        // Fetch users when search query changes
        if (!loading && search) {
            timeout = setTimeout(async () => {
                const users = await fecthMutualConnections(search);
                setResults(users);
                setLoading(false);
            }, 300);
        }

        // Unmount cleanup
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
            setLoading(false);
        };
    }, [loading, search]);

    const handleSelect = (userId: string) => {
        if (!userId) return;

        setSearch('');
        setResults([]);
        setLoading(false);

        // TODO: navigate to chat
        router.push(`/chat/${userId}?new=true`);
    }

    return (
        <React.Fragment>
            <div className="w-full">
                {/* Header */}
                <div className="p-4 h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-neutral-900">
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                        <MessageCircle size={20} className="text-blue-500 dark:text-blue-400" />
                        <span className="hidden sm:inline">Messages</span>
                        <span className="sm:hidden">Chat</span>
                    </div>
                </div>

                {/* Search box */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users..."
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-100 dark:bg-neutral-800 text-sm 
                       text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Search results */}
                    <div className="mt-2">
                        {!loading ? (
                            search && results.length > 0 && (
                                <div className="bg-white dark:bg-neutral-900 shadow-lg rounded-xl overflow-hidden max-h-48 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                                    {results.map((user) => {
                                        if (!hasParticipantInNonGroup(conversations, user._id)) {
                                            return (
                                                <div
                                                    key={user._id}
                                                    onClick={() => handleSelect(user._id)}
                                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer transition"
                                                >
                                                    <Image
                                                        src={user.image || "/images/default-profile.png"}
                                                        alt={user.name}
                                                        loading="lazy"
                                                        width={36}
                                                        height={36}
                                                        className="w-9 h-9 rounded-full object-cover"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                                                        {user.name}
                                                    </span>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            )
                        ) : (
                            <div className="flex justify-center items-center p-4 bg-white dark:bg-neutral-900 rounded-xl shadow">
                                <Loader2 size={20} className="animate-spin text-blue-500" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ChatListheader;