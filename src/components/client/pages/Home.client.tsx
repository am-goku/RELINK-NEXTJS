'use client';

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/navbar/Navbar";
import SkeletonPostCard from "@/components/ui/skeletons/SkeletonPostCard";
import { IPublicPost } from "@/utils/sanitizer/post";
import apiInstance from "@/lib/axios";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Session } from "next-auth";
import CreatePostModal from "@/components/modal/CreatePostModal";
import PostCard from "@/components/post/PostCard.client";
import FramerScroll from "@/components/ui/scrolls/FramerScroll";
import ScrollToTop from "@/components/ui/scrolls/ScrollToTop";

export default function DashboardClient({ session }: { session: Session }) {
    const [showModal, setShowModal] = useState(false);
    const [posts, setPosts] = useState<IPublicPost[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    useEffect(() => {
        setLoadingPosts(true);
        apiInstance.get("/api/posts")
            .then((res) => setPosts(res.data.posts))
            .catch((err) => console.log(err))
            .finally(() => setLoadingPosts(false));
    }, []);

    return (
        <FramerScroll>
            <div className="flex flex-grow px-4 pt-20 flex-col min-h-screen bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text transition-colors">
                <Navbar type="home" session={session} />
                <main className="flex-grow px-4">
                    <div className="md:px-10 max-w-2xl md:mx-auto py-4">
                        {/* CREATE POST OPTION */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 w-full flex justify-between items-center transition-colors">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Posts</h2>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-colors"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Create Post
                            </button>
                        </div>

                        {loadingPosts ? (
                            Array.from({ length: 3 }).map((_, i) => <SkeletonPostCard key={i} />)
                        ) : (
                            posts.map((post, index) => (
                                <div key={post._id}>
                                    <PostCard {...post} currentUserID={session.user?.id as string} />
                                    {index !== posts.length - 1 && (
                                        <div className="border-t my-4 border-gray-200 dark:border-gray-700" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </main>
                {showModal && <CreatePostModal onClose={() => setShowModal(false)} />}
                    <ScrollToTop />
            </div>
        </FramerScroll>
    );
}
