// app/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const allUsers = [
    { id: 1, name: 'Ava Johnson', username: 'avaj', avatar: '/images/default-profile.png' },
    { id: 2, name: 'Liam Brown', username: 'liamb', avatar: '/images/default-profile.png' },
    { id: 3, name: 'Noah Smith', username: 'noahsmith', avatar: '/images/default-profile.png' },
    { id: 4, name: 'Emma Davis', username: 'emmad', avatar: '/images/default-profile.png' },
    { id: 5, name: 'Oliver Wilson', username: 'oliverw', avatar: '/images/default-profile.png' },
];

const allTags = ['fitness', 'travel', 'coding', 'design', 'food'];

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';

    const [filteredUsers, setFilteredUsers] = useState<{id:number, name: string, username: string, avatar: string}[]>([]);
    const [filteredTags, setFilteredTags] = useState<string[]>([]);

    useEffect(() => {
        setFilteredUsers(
            allUsers.filter(
                (user) =>
                    user.name.toLowerCase().includes(query) ||
                    user.username.toLowerCase().includes(query)
            )
        );
        setFilteredTags(allTags.filter((tag) => tag.toLowerCase().includes(query)));

    }, [query]);

    return (
        <div className="px-4 py-6 max-w-5xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">Search results for: <span className="text-[#6C5CE7]">&quot;{query}&quot;</span></h1>

            {/* Users */}
            {filteredUsers.length > 0 && (
                <div>
                    <h2 className="text-xl font-medium mb-4">Users</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredUsers.map((user) => (
                            <div key={user.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#F0F2F5] shadow-sm">
                                <Image src={user.avatar} alt={user.name} width={48} height={48} className="rounded-full object-cover" />
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-gray-500">@{user.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tags */}
            {filteredTags.length > 0 && (
                <div>
                    <h2 className="text-xl font-medium mb-4">Tags</h2>
                    <div className="flex flex-wrap gap-3">
                        {filteredTags.map((tag, i) => (
                            <div key={i} className="bg-[#6C5CE7] text-white px-3 py-1 rounded-full text-sm cursor-pointer">
                                #{tag}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Results */}
            {filteredUsers.length === 0 &&
                filteredTags.length === 0 && (
                    <div className="text-gray-500 text-center pt-12">
                        No results found for <strong>{query}</strong>.
                    </div>
                )}
        </div>
    );
}
