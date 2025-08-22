'use client'

import React, { useEffect, useState } from "react";
import CoverImage from "../../components/CoverImage";
import Navbar from "../../components/ui/Navbar";
import PostCard from "../../components/PostCard";
import ProfileHeader from "../../components/ProfileHeader";
import ProfileStats from "../../components/ProfileStats";
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
import { useUser } from "@/providers/UserProvider";
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
        if (user) {
            getPostsByUsername({
                username: user.username,
                setResponse: setPosts,
                setError,
                setLoading: setLoadingPosts
            })
        }
    }, [user])

    // Connection management
    useEffect(() => {
        if (user && session) {
            setFollowers(user.followersCount);
            const following = hasConnection(user.followers as ShortUser[], session.user.id);
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
            <div className="min-h-screen bg-gray-100">
                <Navbar type="profile" />
                <div className="md:px-20">
                    <CoverImage />
                    <div className="relative">
                        <ProfileHeader user={user} />
                        {!isOwner && (
                            <div className="absolute top-2 right-4 md:top-4 md:right-10 flex space-x-2">
                                {isFollowing ? (
                                    <>
                                        <UnfollowButton
                                            id={user?._id}
                                            setFollowers={setFollowers}
                                            setIsFollowing={setIsFollowing}
                                            setError={setError} key="unfollow" />
                                        {
                                            user?.messageFrom === 'everyone' && (
                                                <MessageButton />
                                            )
                                        }
                                    </>
                                ) : (
                                    <FollowButton
                                        id={user?._id}
                                        setFollowers={setFollowers}
                                        setIsFollowing={setIsFollowing}
                                        setError={setError} key="follow" />
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row md:justify-between px-4 md:px-10 mt-2">
                        <div>
                            <ProfileStats user={user} followers={followers} />
                        </div>
                    </div>

                    <div className="px-4 md:px-10 mt-6 max-w-2xl mx-auto">
                        {loadingPosts ? (
                            Array.from({ length: 3 }).map((_, i) => <SkeletonPostCard key={i} />)
                        ) : (
                            posts.map((post, index) => (
                                <React.Fragment key={post._id}>
                                    <PostCard {...post} currentUserID={session?.user?.id as string} />
                                    {index !== posts.length - 1 && <div className="border-t my-4" />}
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
