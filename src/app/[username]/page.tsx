'use client'

import React, { useEffect, useState } from "react";
import CoverImage from "../../components/profile/CoverImage";
import Navbar from "../../components/ui/navbar/Navbar";
import PostCard from "../../components/cards/PostCard";
import ProfileHeader from "../../components/profile/ProfileHeader";
import LoaderScreen from "../../components/loaders/LoaderScreen";
import { useSession } from "next-auth/react";
import SkeletonPostCard from "@/components/skeletons/SkeletonPostCard";
import { useParams } from "next/navigation";
import UserNotFound from "@/components/error/userNotFound";
import { FollowButton, MessageButton, UnfollowButton } from "@/components/buttons/connectionButtons";
import { getUserProfileData } from "@/services/api/user-apis";
import { getPostsByUsername } from "@/services/api/post-apis";
import { IPublicPost } from "@/utils/sanitizer/post";
import { SanitizedUser, ShortUser } from "@/utils/sanitizer/user";
import { useUser } from "@/context/UserContext";
import { hasConnection, toggleFollower } from "@/utils/connections/user-connection";


function Page() {

    const { data: session, status } = useSession();
    const { setUser: set_c_user } = useUser();
    const params = useParams()
    const [user, setUser] = useState<SanitizedUser | null>(null);
    const [error, setError] = useState<string>('');
    const [posts, setPosts] = useState<IPublicPost[] | []>([])
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [isOwner, setIsOwner] = useState<boolean>(false);

    // connection states
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [followers, setFollowers] = React.useState<number>(0);

    // Fetching User
    useEffect(() => {
        if (params.username) {
            setLoadingUser(true);
            getUserProfileData({
                username: params.username as string,
                setProfileData: setUser,
                setIsOwner,
                setError
            }).finally(() => setLoadingUser(false))
        }
    }, [params.username])

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
                toggleFollower(set_c_user, user);
            }
        }

        return () => {
            setFollowers(0);
            setIsFollowing(false);
        }
    }, [user, session, set_c_user]); // removed isFollowing from deps

    // Error handling
    useEffect(() => {
        if (error) console.log(error)
        return () => {
            setError('')
        }
    }, [error])

    if (status === 'loading' || loadingUser) {
        return <LoaderScreen />
    }

    if (!user && !loadingUser) {
        return <UserNotFound />;
    }

    return (
        <React.Fragment>
            <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 transition-colors">
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
        </React.Fragment>
    )
}

export default Page
