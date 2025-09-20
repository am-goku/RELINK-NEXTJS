'use client'

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Header from "@/components/nav/header";
import { Session } from "next-auth";
import { hasConnection } from "@/utils/connections/user-connection";
import { SanitizedUser, ShortUser } from "@/utils/sanitizer/user";
import { IPublicPost } from "@/utils/sanitizer/post";
import SkeletonPostCard from "@/components/ui/skeletons/SkeletonPostCard";
import { getPostsByUsername } from "@/services/api/post-apis";
import PostCard from "@/components/ui/cards/postCard";
import { FollowButton, MessageButton, UnfollowButton } from "@/components/ui/buttons/connectionButtons";
import { FollowersTab, FollowingTab } from "./tabs.profile";
import ProfileCover from "./cover.profile";
import ProfilePic from "./image.Profile";

type Props = {
    session: Session | null;
    user: SanitizedUser;
    isOwner: boolean;
}

type Tab = 'posts' | 'about' | 'followers' | 'following';

export default function ProfilePage({ session, user, isOwner }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("posts");

    // const [user, setUser] = useState<SanitizedUser | null>(null);
    const [error, setError] = useState<string>('');
    const [posts, setPosts] = useState<IPublicPost[] | []>([])
    const [loadingPosts, setLoadingPosts] = useState(true);

    // connection states
    const [isFollowing, setIsFollowing] = useState<boolean>(true);

    // Fetching User Posts
    useEffect(() => {
        const fetch_posts = async () => {
            setLoadingPosts(true);
            const res = await getPostsByUsername({ username: user.username });
            setPosts(res);
            setLoadingPosts(false);
        }
        if (user?.username) fetch_posts();
    }, [user?.username])

    // Connection management
    useEffect(() => {
        if (user && session) {
            const following = hasConnection(user.followers as ShortUser[], session.user.id);
            setIsFollowing(following);
        }
        return () => {
            setIsFollowing(false);
        }
    }, [user, session]);

    // Error handling
    useEffect(() => {
        if (error) console.log(error)
        return () => {
            setError('')
        }
    }, [error])

    return (
        <div className="min-h-screen bg-[#F0F2F5] dark:bg-neutral-900 text-[#2D3436] dark:text-gray-200 relative">
            {/* Header Section */}
            <Header page="profile" profile_id={user._id.toString()} />

            {/* Cover Section */}
            <ProfileCover isOwner={isOwner} user={user} />

            {/* Profile Info */}
            <div className="relative max-w-4xl mx-auto px-4 -mt-16">
                <div className="flex items-center gap-4">
                    <ProfilePic isOwner={isOwner} user={user} />
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold">{user.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
                        {
                            !isOwner && (
                                <div className="flex gap-2 mt-2">
                                    {
                                        isFollowing ? (
                                            <UnfollowButton id={user?._id} setIsFollowing={setIsFollowing} />
                                        ) : (
                                            <FollowButton id={user?._id} setIsFollowing={setIsFollowing} />
                                        )

                                    }
                                    <MessageButton />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

            {/* Sticky Tabs */}
            <div className="mt-8 border-b border-gray-300 dark:border-gray-700 sticky top-0 bg-[#F0F2F5] dark:bg-neutral-900 z-10">
                <div className="max-w-4xl mx-auto flex gap-6 px-4">
                    {([
                        { key: "posts", label: "Posts" },
                        { key: "about", label: "About" },
                        { key: "followers", label: "Followers" },
                        { key: "following", label: "Following" },
                    ] as { key: Tab; label: string }[]).map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`pb-2 transition-colors border-b-2 ${activeTab === tab.key
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent hover:text-blue-600"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto px-4 mt-6"
            >
                {activeTab === "posts" && (
                    <div className="space-y-4">
                        {loadingPosts ? (
                            Array.from({ length: 3 }).map((_, i) => <SkeletonPostCard key={i} />)
                        ) : (
                            posts.map((post, index) => (
                                <React.Fragment key={post._id}>
                                    <PostCard onLike={() => { }} post={post} />
                                    {index !== posts.length - 1 && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 my-4 transition-colors" />
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "about" && (
                    <div className="bg-white dark:bg-dark-bg/90 p-4 rounded-2xl shadow">
                        <h3 className="font-semibold text-lg mb-2">About John Doe</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            Passionate developer, loves building web apps with Next.js and
                            Tailwind.
                        </p>
                    </div>
                )}

                {activeTab === "followers" && (
                    <FollowersTab user_id={user?._id} />
                )}

                {activeTab === "following" && (
                    <FollowingTab user_id={user?._id} />
                )}
            </motion.div>

            {/* Floating Create Post Button */}
            <button className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg bg-[#2D3436] text-white hover:brightness-110 dark:bg-gray-200 dark:text-neutral-900 transition">
                <Plus size={24} />
            </button>
        </div>
    );
}
