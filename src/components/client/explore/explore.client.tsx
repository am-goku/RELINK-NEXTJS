"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SuggestedPosts from "@/components/client/explore/suggested.explore";
import PostTab from "@/components/client/explore/postTab.explore";
import UserTab from "@/components/client/explore/userTab.explore";
import TagsTab from "@/components/client/explore/tagsTab.explore";
import ExploreModal from "@/components/modal/exploreModal";
import ExploreSearchBar from "./search.explore";
import { IPublicPost } from "@/utils/sanitizer/post";
import { SanitizedUser } from "@/utils/sanitizer/user";
import Header from "@/components/nav/header";

export default function ExplorePage() {
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"posts" | "users" | "tags">("users");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const [imagePosts, setImagePosts] = useState<IPublicPost[]>([]);

    const [resultPosts, setResultPosts] = useState<IPublicPost[]>([]);
    const [resultUsers, setResultUsers] = useState<SanitizedUser[]>([]);
    const [resultTags, setResultTags] = useState<string[]>([]);

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

    useEffect(() => {
        console.log(
            "🚀 ~ file: explore.client.tsx:96 ~ useEffect ~: \n",
            resultPosts, "\n",
            resultUsers, "\n",
            resultTags, "\n"
        )
    }, [resultPosts, resultUsers, resultTags])

    return (
        <div className="min-h-screen bg-[#F0F2F5] dark:bg-neutral-900 text-[#2D3436] dark:text-gray-200 pb-8">
            <Header page="explore" />
            {/* Page header */}
            <header className="sticky top-0 z-10 bg-[#F0F2F5] dark:bg-neutral-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
                    {/* <h2 className="text-lg font-semibold">Explore</h2> */}

                    <div className="relative flex-1 max-w-xl">
                        <ExploreSearchBar
                            activeTab={activeTab}
                            setQuery={setQuery}
                            setResultPosts={setResultPosts}
                            setResultUsers={setResultUsers}
                            setResultTags={setResultTags}
                        />
                    </div>

                    {
                        query && (
                            <div className="ml-auto flex items-center gap-2">
                                <button onClick={() => setActiveTab("posts")} className={`px-3 py-2 rounded-md ${activeTab === "posts" ? "bg-[#2D3436] text-white" : "bg-white dark:bg-neutral-800"}`}>Posts</button>
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
                    (!query && (resultPosts.length === 0 && resultUsers.length === 0 && resultTags.length === 0)) ? (
                        <SuggestedPosts openModalAt={openModalAt} setImagePosts={setImagePosts} />
                    ) : (
                        <section className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Results</h3>
                                <div className="text-sm opacity-70">{query ? `Searching: "${query}"` : "Showing top content"}</div>
                            </div>

                            <div>
                                {activeTab === "posts" && (
                                    <PostTab resultPosts={resultPosts} openModalAt={openModalAt} />
                                )}

                                {activeTab === "users" && (
                                    <UserTab resultUsers={resultUsers} />
                                )}

                                {activeTab === "tags" && (
                                    <TagsTab resultTags={resultTags} setQuery={setQuery} setActiveTab={setActiveTab} />
                                )}
                            </div>
                        </section>
                    )
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
