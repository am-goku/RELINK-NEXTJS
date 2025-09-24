"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import PostTab from "@/components/client/explore/postTab.explore";
import UserTab from "@/components/client/explore/userTab.explore";
import TagsTab from "@/components/client/explore/tagsTab.explore";
import ExploreModal from "@/components/modal/exploreModal";
import ExploreSearchBar from "./search.explore";
import { IPublicPost } from "@/utils/sanitizer/post";
import Header from "@/components/nav/header";
import { useRouter, useSearchParams } from "next/navigation";

type Tab = "posts" | "users" | "tags";

export default function ExplorePage() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const tabFromQuery = (searchParams.get("tab") as Tab) || "posts";
    const query = searchParams.get("q") || "";
    const activeTab = tabFromQuery;

    const setActiveTab = (tab: Tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        router.replace(`/explore?${params.toString()}`, { scroll: false });
    };

    const setQuery = (q: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("q", q);
        router.replace(`/explore?${params.toString()}`, { scroll: false });
    };

    // Modal states
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


    function openModalAt(index: number) {
        setModalIndex(index);
        setModalOpen(true);
        document.body.style.overflow = "hidden";
    }

    return (
        <div className="min-h-screen bg-[#F0F2F5] dark:bg-neutral-900 text-[#2D3436] dark:text-gray-200 pb-8">
            <Header page="explore" />
            {/* Page header */}
            <header className="sticky top-0 z-10 bg-[#F0F2F5] dark:bg-neutral-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">

                    <div className="relative flex-1 max-w-xl">
                        <ExploreSearchBar
                            setQuery={setQuery}
                        />
                    </div>

                    {/** Tabs [Posts, Users, Tags] */}
                    <div className="ml-auto flex items-center gap-2">
                        <button onClick={() => setActiveTab("posts")} className={`px-3 py-2 rounded-md ${activeTab === "posts" ? "bg-[#2D3436] text-white" : "bg-white dark:bg-neutral-800"}`}>Posts</button>
                        <button onClick={() => setActiveTab("users")} className={`px-3 py-2 rounded-md ${activeTab === "users" ? "bg-[#2D3436] text-white" : "bg-white dark:bg-neutral-800"}`}>Users</button>
                        <button onClick={() => setActiveTab("tags")} className={`px-3 py-2 rounded-md ${activeTab === "tags" ? "bg-[#2D3436] text-white" : "bg-white dark:bg-neutral-800"}`}>Tags</button>
                    </div>

                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 mt-6">
                {/* Suggested posts grid (only image posts) */}
                {
                    <section className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-sm opacity-70">{query ? `Searching: "${query}"` : "Showing top content"}</div>
                        </div>

                        <div>
                            {activeTab === "posts" && (
                                <PostTab query={query} setImagePosts={setImagePosts} openModalAt={openModalAt} />
                            )}

                            {activeTab === "users" && (
                                <UserTab query={query} />
                            )}

                            {activeTab === "tags" && (
                                <TagsTab query={query} />
                            )}
                        </div>
                    </section>
                }
            </main>

            {/* Reel modal - full screen */}
            <AnimatePresence>
                {(modalOpen && imagePosts.length > 0) && (
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
