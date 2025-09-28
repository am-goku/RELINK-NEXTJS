'use client'

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, MessageSquare, Plus, UserMinus, UserPlus } from "lucide-react";
import Header from "@/components/nav/header";
import { Session } from "next-auth";
import { SanitizedUser } from "@/utils/sanitizer/user";
import { IPublicPost } from "@/utils/sanitizer/post";
import { getPostsByUsername } from "@/services/api/post-apis";
import ProfileCover from "./cover.profile";
import ProfilePic from "./image.Profile";
import CreatePostModal from "@/components/modal/createPost";
import { followUser, unfollowUser } from "@/services/api/user-apis";
import { ActionButton } from "@/components/template/action-button";
import ConnectionsTab from "./tabs.profile";
import { AboutCard } from "./about.profile";
import PostList from "./posts.profile";
import { useUserStore } from "@/stores/userStore";

type Props = {
    session: Session;
    initialUser: SanitizedUser;
    isOwner: boolean;
}

type Tab = 'posts' | 'about' | 'followers' | 'following';

export default function ProfilePage({ session, initialUser, isOwner }: Props) {

    // Profile user state
    const [user, setUser] = useState<SanitizedUser>(initialUser);
    const [posts, setPosts] = useState<IPublicPost[]>([])

    // Global states
    const isFollowing = useUserStore(state => state.user?.following.includes(user._id));

    // UI states
    const [activeTab, setActiveTab] = useState<Tab>("posts");
    const [error, setError] = useState<string>('');
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [loadingConnection, setLoadingConnection] = useState<boolean>(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

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

    // Error handling
    useEffect(() => {
        if (error) console.log(error)
        return () => {
            setError('')
        }
    }, [error])

    // Connection management: follow
    const doFollow = useCallback(async () => {
        if (user._id) {
            setLoadingConnection(true);
            await followUser(user._id);
            useUserStore.getState().updateUser("following", [...(useUserStore.getState().user?.following || []), user._id]);
            setUser(prev => ({ ...prev, followers: [session.user.id, ...prev.followers] }));
            setLoadingConnection(false);
        }
    }, [session.user.id, user._id])

    // Connection management: unfollow
    const doUnfollow = useCallback(async () => {
        if (user._id) {
            setLoadingConnection(true);
            await unfollowUser(user._id);
            useUserStore.getState().updateUser("following", (useUserStore.getState().user?.following || []).filter(id => id !== user._id));
            setUser(prev => ({ ...prev, followers: prev.followers.filter(id => id !== session.user.id) }));
            setLoadingConnection(false);
        }
    }, [session.user.id, user._id])

    // UI Confition
    const canViewProfile =
        isOwner ||
        user.accountType === "public" ||
        (user.accountType === "private" && isFollowing);

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
                                            <ActionButton loading={loadingConnection} onAction={doUnfollow}>
                                                <UserMinus size={16} /> Remove
                                            </ActionButton>
                                        ) : (
                                            <ActionButton loading={loadingConnection} onAction={doFollow}>
                                                <UserPlus size={16} /> Follow
                                            </ActionButton>
                                        )

                                    }
                                    <ActionButton onAction={async () => { }}>
                                        <MessageSquare size={16} /> Message
                                    </ActionButton>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

            {
                canViewProfile ? (
                    <React.Fragment>
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
                                <PostList loadingPosts={loadingPosts} posts={posts} />
                            )}

                            {activeTab === "about" && (
                                <AboutCard user={user} />
                            )}

                            {activeTab === "followers" && (
                                <ConnectionsTab user_id={user?._id} type="followers" />
                            )}

                            {activeTab === "following" && (
                                <ConnectionsTab user_id={user?._id} type="following" />
                            )}
                        </motion.div>
                    </React.Fragment>
                ) : (
                    <div className="mt-8 border-b border-gray-300 dark:border-gray-700 sticky top-0 bg-[#F0F2F5] dark:bg-neutral-900 z-10 flex justify-center py-3">
                        <p className="text-gray-600 dark:text-gray-300 text-center font-medium items-center flex flex-col gap-3">
                            <LockKeyhole size={24} />
                            <span>This profile is private. Only approved connections can view the details.</span>
                        </p>
                    </div>
                )
            }

            {/* Floating Create Post Button */}
            {
                isOwner && (
                    <React.Fragment>

                        <button onClick={() => setShowCreateModal(true)} className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg bg-[#2D3436] text-white hover:brightness-110 dark:bg-gray-200 dark:text-neutral-900 transition">
                            <Plus size={24} />
                        </button>

                        {/* Create modal (placeholder) */}
                        {showCreateModal && (
                            <CreatePostModal
                                open={showCreateModal}
                                onClose={() => setShowCreateModal(false)}
                                updatePostList={setPosts}
                            />
                        )}
                    </React.Fragment>
                )
            }
        </div>
    );
}
