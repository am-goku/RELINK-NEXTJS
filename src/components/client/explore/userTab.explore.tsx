import React, { useMemo } from 'react'

type UserType = { id: string; name: string; username: string; avatar?: string };

// Mock data
const MOCK_USERS: UserType[] = [
    { id: "u1", name: "Asha Menon", username: "asham", avatar: "https://i.pravatar.cc/80?img=32" },
    { id: "u2", name: "Ravi Kumar", username: "ravik", avatar: "https://i.pravatar.cc/80?img=12" },
    { id: "u3", name: "Neha Singh", username: "nehasingh", avatar: "https://i.pravatar.cc/80?img=5" },
    { id: "u4", name: "Priya Nair", username: "priyanair", avatar: "https://i.pravatar.cc/80?img=40" },
];

type Props = {
    query: string;
}

function UserTab({ query }: Props) {

    const searchUsers = useMemo(() => {
        if (!query) return [] as UserType[];
        const q = query.toLowerCase();
        return MOCK_USERS.filter((u) => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q));
    }, [query]);
    
    return (
        <div className="space-y-3">
            {(query ? searchUsers : MOCK_USERS).map((u) => (
                <div key={u.id} className="rounded-xl bg-white/90 dark:bg-neutral-800/80 p-3 shadow flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1">
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-xs opacity-70">@{u.username}</div>
                    </div>
                    <button onClick={() => window.location.href = `/${u.username}`} className="px-3 py-1 rounded-md bg-[#2D3436] text-white">View</button>
                </div>
            ))}
        </div>
    )
}

export default UserTab