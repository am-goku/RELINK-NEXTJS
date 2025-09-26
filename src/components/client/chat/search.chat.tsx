import Avatar from '@/components/template/avatar';
import { hasParticipantInNonGroup } from '@/helpers/chat-helper';
import { IConversationPopulated } from '@/models/Conversation';
import { fecthMutualConnections } from '@/services/api/user-apis';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Types } from 'mongoose';
import { Session } from 'next-auth';
import React, { useCallback, useEffect } from 'react'

type Props = {
    rooms: IConversationPopulated[];
    session: Session;
    setActiveRoom: (x: IConversationPopulated) => void;
    setNewChat: (x: boolean) => void;
}

function ChatSearchBar({ rooms, session, setNewChat, setActiveRoom }: Props) {
    const [query, setQuery] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [searchResults, setResults] = React.useState<IConversationPopulated['participants']>([]);

    // Connection fetch
    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null; // Initializing timeout variable

        if (!loading && !query.trim()) {
            setResults([]);
            return;
        }

        // Fetch users when search query changes
        if (!loading && query.trim()) {
            timeout = setTimeout(async () => {
                const users = await fecthMutualConnections(query.trim());
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
    }, [loading, query]);

    const createNewChatModel = useCallback((receiver: IConversationPopulated['participants'][0]): IConversationPopulated => {
        return {
            _id: new Types.ObjectId(),
            participants: [{
                _id: new Types.ObjectId(session.user.id),
                username: session.user.username,
                name: session?.user?.name || undefined,
                image: session.user.image || undefined,
            }, {
                _id: receiver._id,
                username: receiver.username,
                name: receiver.name || undefined,
                image: receiver.image || undefined,
            }],
            is_group: false,
            group_image: undefined,
            group_name: undefined,
            last_message: undefined,
            created_at: new Date(),
            updated_at: new Date(),
        }
    }, [session.user.id, session.user.image, session.user?.name, session.user.username])

    const manageNewChat = useCallback((receiver: IConversationPopulated['participants'][0]) => {
        const newRoom = createNewChatModel(receiver);
        setNewChat(true);
        setActiveRoom(newRoom);
    }, [createNewChatModel, setActiveRoom, setNewChat])

    return (
        <div className="p-3">
            <div className="relative">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users or rooms" className="w-full rounded-xl border px-3 py-2 text-sm outline-none" />
                <Search className="absolute right-3 top-2.5 h-4 w-4 opacity-70" />
            </div>
            <AnimatePresence>
                {searchResults.length > 0 && (
                    <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 max-h-40 overflow-auto rounded-lg border bg-white dark:bg-neutral-900 p-2">
                        {searchResults.map((u) => {
                            if (!hasParticipantInNonGroup(rooms, u._id.toString())) {
                                return (
                                    <li onClick={() => manageNewChat(u)} key={u._id.toString()} className="flex items-center gap-3 px-2 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md cursor-pointer">
                                        <Avatar user={{...u, _id: u._id.toString()}} key={u._id.toString()} size={9} />
                                        <div className="flex-1 text-sm">
                                            <div className="font-medium">{u.name || u.username}</div>
                                        </div>
                                        <button className="text-sm text-blue-600">Message</button>
                                    </li>
                                )
                            }
                        }
                        )}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ChatSearchBar