import React, { useCallback, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import apiInstance from '@/lib/axios';
import { IPublicPost } from '@/utils/sanitizer/post';

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
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    setActiveTab: React.Dispatch<React.SetStateAction<"posts" | "users" | "tags">>;
    setImagePosts: React.Dispatch<React.SetStateAction<IPublicPost[]>>
}

function SearchResults({ query, setActiveTab, setQuery, setImagePosts }: Props) {

    const [searchPosts, setSearchPosts] = useState<IPublicPost[]>([]);

    const [busy, setBusy] = useState<boolean>(false);

    const searchTags = useMemo(() => {
        if (!query) return [] as string[];
        const q = query.toLowerCase();
        const tags = new Set<string>();
        MOCK_POSTS.forEach((p) => p.tags?.forEach((t) => { if (t.includes(q)) tags.add(t); }));
        return Array.from(tags);
    }, [query]); // TODO: Need to manage apis

    const searchUsers = useMemo(() => {
        if (!query) return [] as UserType[];
        const q = query.toLowerCase();
        return MOCK_USERS.filter((u) => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q));
    }, [query]); // TODO: Need to implement apis


    // Search posts function -- START --
    const searchPostsFun = useCallback(async () => {
        if (!query) return;
        if (busy) return;
        const q = query.toLowerCase();
        const res = (await apiInstance.get(`/api/posts/search?searchKey=${q}`)).data;
        setSearchPosts(res.posts);
        setImagePosts(res.posts);
        setActiveTab("posts");
        setTimeout(() => setBusy(false), 1000);
    }, [busy, query, setActiveTab, setImagePosts]);
    React.useEffect(() => {
        if (query) searchPostsFun();
    }, [query, searchPostsFun]);
    // Search posts function -- END --



    return (
        <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-0 right-0 mt-2 rounded-xl bg-white dark:bg-neutral-800 shadow-lg border overflow-hidden z-20">
            {/* simple grouped suggestions */}
            {searchUsers.slice(0, 3).map((u) => (
                <li key={u.id} className="flex items-center gap-3 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" onMouseDown={() => { window.location.href = `/${u.username}`; }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                        <div className="font-medium text-sm">{u.name}</div>
                        <div className="text-xs opacity-70">@{u.username}</div>
                    </div>
                </li>
            ))}

            {searchPosts?.slice(0, 4).map((p) => (
                <li key={p._id} className="px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                    <div className="text-sm">{p.content || "Image post"}</div>
                    <div className="text-xs opacity-70">by @{p.user.username}</div>
                </li>
            ))}

            {searchTags.slice(0, 6).map((t) => (
                <li key={t} className="px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" onMouseDown={() => { setQuery(t); setActiveTab("tags"); }}>
                    <div className="text-sm">#{t}</div>
                </li>
            ))}

            {searchUsers.length === 0 && searchPosts.length === 0 && searchTags.length === 0 && (
                <li className="px-3 py-2 text-sm opacity-70">No suggestions</li>
            )}
        </motion.ul>
    )
}

export default SearchResults