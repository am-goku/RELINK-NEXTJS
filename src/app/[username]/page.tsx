'use client'

import React, { useEffect, useState } from "react";
import CoverImage from "../../components/CoverImage";
import Navbar from "../../components/ui/Navbar";
import PostCard from "../../components/PostCard";
import ProfileHeader from "../../components/ProfileHeader";
import ProfileStats from "../../components/ProfileStats";
import LoaderScreen from "../../components/loaders/LoaderScreen";
import { IPublicPost } from "../../models/Post";
import { useSession } from "next-auth/react";
import SkeletonPostCard from "@/components/skeletons/SkeletonPostCard";
import { useParams } from "next/navigation";
import { IUser } from "@/models/User";
import UserNotFound from "@/components/error/userNotFound";
import { FollowButton, MessageButton, UnfollowButton } from "@/components/buttons/connectionButtons";
import { getUserProfileData } from "@/services/api/user-apis";
import { getPostsByUsername } from "@/services/api/post-apis";
import { normalizeToObjectId } from "@/utils/types/normalize";


function Page() {

    const { data: session, status } = useSession();
    const params = useParams()
    const [user, setUser] = useState<IUser | null>(null);
    const [error, setError] = useState<string>('');
    const [posts, setPosts] = useState<IPublicPost[] | []>([])
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [isOwner, setIsOwner] = useState<boolean>(false);

    // connection states
    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    // Fetching User
    useEffect(() => {
        if (params.username) {
            getUserProfileData({
                username: params.username as string,
                setProfileData: setUser,
                setIsOwner,
                setError
            })
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
            const sessionUserId = normalizeToObjectId(session.user.id);
            setIsFollowing(user.followers.includes(sessionUserId));
        }
    }, [user, session])

    // Error alert
    useEffect(() => {
        if (error) alert(error);
        return () => {
            setError('')
        }
    }, [error])

    if (status === 'loading') {
        return <LoaderScreen />
    }

    return (
        <React.Fragment>
            {
                user ?
                    (
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
                                                        id={user._id}
                                                        c_userId={session?.user?.id as string}
                                                        setUser={setUser}
                                                        setError={setError} key="unfollow" />
                                                    <MessageButton />
                                                </>
                                            ) : (
                                                <FollowButton
                                                    id={user._id}
                                                    c_userId={session?.user?.id as string}
                                                    setUser={setUser}
                                                    setError={setError} key="follow" />
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col md:flex-row md:justify-between px-4 md:px-10 mt-2">
                                    <div>
                                        <ProfileStats user={user} />
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
                    )
                    :
                    <UserNotFound />
            }
        </React.Fragment>
    )
}

export default Page
