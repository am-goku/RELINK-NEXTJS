"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SuggestedPosts from "@/components/client/explore/suggested.explore";
import PostTab from "@/components/client/explore/postTab.explore";
import UserTab from "@/components/client/explore/userTab.explore";
import TagsTab from "@/components/client/explore/tagsTab.explore";
import ExploreModal from "@/components/modal/exploreModal";
import SearchResults from "./results.explore";
import ExploreSearchBar from "./search.explore";
import { IPublicPost } from "@/utils/sanitizer/post";

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

export default function ExplorePage() {
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeTab, setActiveTab] = useState<"posts" | "users" | "tags">("posts");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const [imagePosts, setImagePosts] = useState<IPublicPost[]>([]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (!modalOpen) return;
            if (e.key === "ArrowUp") setModalIndex((s) => Math.max(0, s - 1));
            if (e.key === "ArrowDown") setModalIndex((s) => Math.min(s + 1, imagePosts.length - 1));
            if (e.key === "Escape") setModalOpen(false);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [imagePosts.length, modalOpen]);


    const searchPosts = useMemo(() => {
        if (!query) return [] as PostType[];
        const q = query.toLowerCase();
        return MOCK_POSTS.filter((p) => (p.text || "").toLowerCase().includes(q) || p.tags?.some((t) => t.includes(q)));
    }, [query]);

    function openModalAt(index: number) {
        setModalIndex(index);
        setModalOpen(true);
        document.body.style.overflow = "hidden";
    }

    return (
        <div className="min-h-screen bg-[#F0F2F5] dark:bg-neutral-900 text-[#2D3436] dark:text-gray-200 pb-8">
            {/* Page header */}
            <header className="sticky top-0 z-10 bg-[#F0F2F5] dark:bg-neutral-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
                    {/* <h2 className="text-lg font-semibold">Explore</h2> */}

                    <div className="relative flex-1 max-w-xl">
                        <ExploreSearchBar query={query} setActiveTab={setActiveTab} setQuery={setQuery} setShowSuggestions={setShowSuggestions} />

                        <AnimatePresence>
                            {showSuggestions && query && (
                                <SearchResults
                                    query={query}
                                    setActiveTab={setActiveTab}
                                    setQuery={setQuery}
                                    setImagePosts={setImagePosts}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {
                        query && (
                            <div className="ml-auto flex items-center gap-2">
                                <button onClick={() => setActiveTab("posts")} className={`px-3 py-2 rounded-md ${activeTab === "posts" ? "bg-[#2D3436] text-white" : "bg-white dark:bg-neutral-800"}`}>All</button>
                                <button onClick={() => setActiveTab("users")} className={`px-3 py-2 rounded-md ${activeTab === "users" ? "bg-[#2D3436] text-white" : "bg-white dark:bg-neutral-800"}`}>Users</button>
                                <button onClick={() => setActiveTab("tags")} className={`px-3 py-2 rounded-md ${activeTab === "tags" ? "bg-[#2D3436] text-white" : "bg-white dark:bg-neutral-800"}`}>Tags</button>
                            </div>
                        )
                    }

                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 mt-6">
                {/* Suggested posts grid (only image posts) */}
                {
                    (!query || !searchPosts.length) ? (
                        <SuggestedPosts openModalAt={openModalAt} setImagePosts={setImagePosts} />
                    ) : (
                        <section className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Results</h3>
                                <div className="text-sm opacity-70">{query ? `Searching: "${query}"` : "Showing top content"}</div>
                            </div>

                            <div>
                                {activeTab === "posts" && (
                                    <PostTab query={query} openModalAt={openModalAt} />
                                )}

                                {activeTab === "users" && (
                                    <UserTab query={query} />
                                )}

                                {activeTab === "tags" && (
                                    <TagsTab query={query} setQuery={setQuery} setActiveTab={setActiveTab} />
                                )}
                            </div>
                        </section>
                    )
                }
            </main>

            {/* Reel modal - full screen */}
            <AnimatePresence>
                {modalOpen && (
                    <ExploreModal
                        modalIndex={modalIndex}
                        imagePosts={imagePosts}
                        setModalIndex={setModalIndex}
                        setModalOpen={setModalOpen}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
