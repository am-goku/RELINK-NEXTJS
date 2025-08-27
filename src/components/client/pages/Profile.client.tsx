'use client'

import React, { useEffect, useState } from "react";
import CoverImage from "../../profile/CoverImage";
import Navbar from "../../ui/navbar/Navbar";
import { Session } from 'next-auth'
import ProfileHeader from "../../profile/ProfileHeader";
import SkeletonPostCard from "@/components/ui/skeletons/SkeletonPostCard";
import { FollowButton, MessageButton, UnfollowButton } from "@/components/ui/buttons/connectionButtons";
import { getPostsByUsername } from "@/services/api/post-apis";
import { IPublicPost } from "@/utils/sanitizer/post";
import { SanitizedUser, ShortUser } from "@/utils/sanitizer/user";
import { hasConnection, toggleFollower } from "@/utils/connections/user-connection";
import PostCard from "@/components/post/PostCard.client";
import { useUser } from "@/context/UserContext";
import SmoothScroller from "@/components/ui/scrolls/FramerScroll";
import ScrollToTop from "@/components/ui/scrolls/ScrollToTop";

type Props = {
    session: Session | null;
    user: SanitizedUser;
    isOwner: boolean;
}

function ProfileClient({ session, user, isOwner }: Props) {

    const { setUser } = useUser();

    // const [user, setUser] = useState<SanitizedUser | null>(null);
    const [error, setError] = useState<string>('');
    const [posts, setPosts] = useState<IPublicPost[] | []>([])
    const [loadingPosts, setLoadingPosts] = useState(true);

    // connection states
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [followers, setFollowers] = React.useState<number>(0);

    // Fetching User Posts
    useEffect(() => {
        if (user?.username) {
            getPostsByUsername({
                username: user.username,
                setResponse: setPosts,
                setError,
                setLoading: setLoadingPosts
            })
        }
    }, [user?.username])

    // Connection management
    useEffect(() => {
        if (user && session) {
            const following = hasConnection(user.followers as ShortUser[], session.user.id);
            setFollowers(user.followersCount);
            setIsFollowing(following);

            // only toggle follower in context if needed
            if (following && !hasConnection(user.followers as ShortUser[], session.user.id)) {
                toggleFollower(setUser, user);
            }
        }

        return () => {
            setFollowers(0);
            setIsFollowing(false);
        }
    }, [user, session, setUser]); // removed isFollowing from deps

    // Error handling
    useEffect(() => {
        if (error) console.log(error)
        return () => {
            setError('')
        }
    }, [error])

    return (
        <React.Fragment>
            <SmoothScroller>
                <div className="min-h-full flex-grow px-4 pt-20 bg-gray-100 dark:bg-neutral-900 transition-colors">
                    <Navbar type="profile" session={session} />
                    <div className="md:px-20">
                        <CoverImage user={user} setUser={isOwner ? setUser : undefined} isOwner={isOwner} />
                        <div className="relative">
                            <ProfileHeader user={user} isOwner={isOwner} setUser={setUser} followers={followers} />
                            {!isOwner && (
                                <div className="absolute top-2 right-4 md:top-4 md:right-10 flex space-x-2">
                                    {isFollowing ? (
                                        <>
                                            <UnfollowButton
                                                id={user?._id}
                                                setFollowers={setFollowers}
                                                setIsFollowing={setIsFollowing}
                                                setError={setError}
                                                key="unfollow"
                                            />
                                            {user?.messageFrom === 'everyone' && <MessageButton />}
                                        </>
                                    ) : (
                                        <FollowButton
                                            id={user?._id}
                                            setFollowers={setFollowers}
                                            setIsFollowing={setIsFollowing}
                                            setError={setError}
                                            key="follow"
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="px-4 md:px-10 mt-6 max-w-2xl mx-auto">
                            {loadingPosts ? (
                                Array.from({ length: 3 }).map((_, i) => <SkeletonPostCard key={i} />)
                            ) : (
                                posts.map((post, index) => (
                                    <React.Fragment key={post._id}>
                                        <PostCard {...post} currentUserID={session?.user?.id as string} />
                                        {index !== posts.length - 1 && (
                                            <div className="border-t border-gray-200 dark:border-gray-700 my-4 transition-colors" />
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <ScrollToTop />
            </SmoothScroller>
        </React.Fragment>
    )
}

export default ProfileClient