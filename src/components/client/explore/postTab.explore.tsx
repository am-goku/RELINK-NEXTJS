import React, { useMemo } from 'react'


type UserType = { id: string; name: string; username: string; avatar?: string };
type PostType = { id: string; author: UserType; text?: string; image?: string; tags?: string[] };

// Mock data
const MOCK_USERS: UserType[] = [
    { id: "u1", name: "Asha Menon", username: "asham", avatar: "https://i.pravatar.cc/80?img=32" },
    { id: "u2", name: "Ravi Kumar", username: "ravik", avatar: "https://i.pravatar.cc/80?img=12" },
    { id: "u3", name: "Neha Singh", username: "nehasingh", avatar: "https://i.pravatar.cc/80?img=5" },
    { id: "u4", name: "Priya Nair", username: "priyanair", avatar: "https://i.pravatar.cc/80?img=40" },
];

const MOCK_POSTS: PostType[] = Array.from({ length: 12 }).map((_, i) => ({
    id: `p${i + 1}`,
    author: MOCK_USERS[i % MOCK_USERS.length],
    text: Math.random() > 0.4 ? `A short caption about image ${i + 1}` : undefined,
    image: `https://picsum.photos/800/9${i + 1}?random=${i + 10}`,
    tags: ["travel", i % 2 ? "design" : "photo"],
}));

type Props = {
    query: string;
    openModalAt: (index: number) => void;
}

function PostTab({ query, openModalAt }: Props) {

    const searchPosts = useMemo(() => {
        if (!query) return [] as PostType[];
        const q = query.toLowerCase();
        return MOCK_POSTS.filter((p) => (p.text || "").toLowerCase().includes(q) || p.tags?.some((t) => t.includes(q)));
    }, [query]);

    const imagePosts = useMemo(() => MOCK_POSTS.filter((p) => p.image), []);

    return (
        <div className="space-y-4">
            {(query ? searchPosts : MOCK_POSTS.slice(0, 6)).map((p) => (
                <article key={p.id} className="rounded-xl bg-white/90 dark:bg-neutral-800/80 p-4 shadow flex gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" className="w-36 h-24 object-cover rounded-md" />
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <div className="font-semibold">{p.author.name}</div>
                            <div className="text-xs opacity-70">@{p.author.username}</div>
                        </div>
                        <p className="mt-2 text-sm line-clamp-3">{p.text}</p>
                        <div className="mt-3 flex items-center gap-3 text-xs opacity-70">
                            <button onClick={() => openModalAt(imagePosts.findIndex(ip => ip.id === p.id))} className="px-2 py-1 rounded-md hover:bg-black/5">View</button>
                            <button className="px-2 py-1 rounded-md hover:bg-black/5">Save</button>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    )
}

export default PostTab