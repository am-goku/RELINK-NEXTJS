import React from 'react'

type UserType = {
    id: string;
    name: string;
    username: string;
    avatar?: string;
};

// --- Mock data / API ---
const dummyUsers: UserType[] = [
    {
        id: "u1",
        name: "Asha Menon",
        username: "asham",
        avatar: "https://i.pravatar.cc/80?img=32",
    },
    {
        id: "u2",
        name: "Ravi Kumar",
        username: "ravik",
        avatar: "https://i.pravatar.cc/80?img=12",
    },
    {
        id: "u3",
        name: "Neha Singh",
        username: "nehasingh",
        avatar: "https://i.pravatar.cc/80?img=5",
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
                            <div key={u.id} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 overflow-hidden rounded-full">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={u.avatar} alt={u.name} className="h-full w-full object-cover" />
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