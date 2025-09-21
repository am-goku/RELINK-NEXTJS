import Avatar from '@/components/template/avatar';
import { SanitizedUser } from '@/utils/sanitizer/user';
import { Types } from 'mongoose';
import React from 'react'

// --- Mock data / API ---
const dummyUsers: SanitizedUser[] = [
    {
        _id: new Types.ObjectId(),
        name: "Asha Menon",
        username: "asham",
        image: "https://i.pravatar.cc/80?img=32",
        role: 'admin',
        bio: undefined,
        gender: undefined,
        cover: undefined,
        links: undefined,
        accountType: 'public',
        messageFrom: 'none',
        onlineStatus: false,
        created_at: undefined,
        updated_at: undefined,
        followers: [],
        following: [],
        followersCount: 0,
        followingCount: 0
    },
    {
        _id: new Types.ObjectId(),
        name: "Ravi Kumar",
        username: "ravik",
        image: "https://i.pravatar.cc/80?img=12",
        role: 'admin',
        bio: undefined,
        gender: undefined,
        cover: undefined,
        links: undefined,
        accountType: 'public',
        messageFrom: 'none',
        onlineStatus: false,
        created_at: undefined,
        updated_at: undefined,
        followers: [],
        following: [],
        followersCount: 0,
        followingCount: 0
    },
    {
        _id: new Types.ObjectId(),
        name: "Neha Singh",
        username: "nehasingh",
        image: "https://i.pravatar.cc/80?img=5",
        role: 'user',
        bio: undefined,
        gender: undefined,
        cover: undefined,
        links: undefined,
        accountType: 'public',
        messageFrom: 'none',
        onlineStatus: false,
        created_at: undefined,
        updated_at: undefined,
        followers: [],
        following: [],
        followersCount: 0,
        followingCount: 0
    },
];

function SuggesionsDashboard() {
    return (
        <aside className="hidden md:block">
            <div className="sticky top-6 space-y-4">
                <div className="rounded-2xl border bg-white/80 p-4 shadow-sm ring-1 ring-black/5 dark:bg-neutral-800/70 dark:ring-white/10">
                    <p className="text-sm font-semibold">Who to follow</p>
                    <div className="mt-3 flex flex-col gap-3">
                        {dummyUsers.map((u) => (
                            <div key={u._id.toString()} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 overflow-hidden rounded-full">
                                        <Avatar user={u} size={10} key={u._id.toString()} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{u.name}</p>
                                        <p className="text-xs opacity-70">@{u.username}</p>
                                    </div>
                                </div>
                                <button className="rounded-full bg-[#2D3436] px-3 py-1 text-xs font-semibold text-white hover:brightness-110">Follow</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border bg-white/80 p-4 shadow-sm ring-1 ring-black/5 dark:bg-neutral-800/70 dark:ring-white/10">
                    <p className="text-sm font-semibold">About LinkSphere</p>
                    <p className="mt-2 text-xs opacity-70">A simple social feed demo built with Next.js, TypeScript, Tailwind, lucide-react and framer-motion.</p>
                </div>
            </div>
        </aside>
    )
}

export default SuggesionsDashboard