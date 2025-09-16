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
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    setActiveTab: React.Dispatch<React.SetStateAction<"posts" | "users" | "tags">>;
}

function TagsTab({ query, setQuery, setActiveTab }: Props) {

    const searchTags = useMemo(() => {
        if (!query) return [] as string[];
        const q = query.toLowerCase();
        const tags = new Set<string>();
        MOCK_POSTS.forEach((p) => p.tags?.forEach((t) => { if (t.includes(q)) tags.add(t); }));
        return Array.from(tags);
    }, [query]);

    return (
        <div className="flex flex-wrap gap-2">
            {(query ? searchTags : ["travel", "photo", "design"]).map((t) => (
                <button key={t} onClick={() => { setQuery(t); setActiveTab("posts"); }} className="px-3 py-1 rounded-full bg-white/90 dark:bg-neutral-800/80 shadow-sm">#{t}</button>
            ))}
        </div>
    )
}

export default TagsTab