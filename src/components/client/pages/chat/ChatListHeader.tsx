import { MessageCircle, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

// Mock search function (replace with API call for users)
async function fetchUsers(query: string) {
    if (!query) return [];
    return [
        { _id: '1', name: 'John Doe' },
        { _id: '2', name: 'Jane Smith' }
    ].filter((u) => u.name.toLowerCase().includes(query.toLowerCase()));
}


function ChatListheader() {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<{ _id: string, name: string }[]>([]);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            const users = await fetchUsers(search);
            setResults(users);
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <React.Fragment>
            <div className="p-4 h-16 border-b text-lg font-semibold flex items-center gap-2 justify-between border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-base font-medium">
                    <MessageCircle size={20} /> Messages
                </div>
            </div>
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users to chat..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {search && results.length > 0 && (
                    <div className="mt-2 bg-white dark:bg-neutral-800 shadow rounded-lg divide-y max-h-40 overflow-y-auto">
                        {results.map((user) => (
                            <div
                                key={user._id}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer text-sm"
                            >
                                {user.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </React.Fragment>
    )
}

export default ChatListheader;