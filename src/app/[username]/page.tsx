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
import { userService } from "@/services/api/apiServices";
import { IUser } from "@/models/User";
import { getErrorMessage } from "@/lib/errors/errorResponse";
import UserNotFound from "@/components/error/userNotFound";


function Page() {

    const { data: session, status } = useSession();
    const params = useParams()
    const [user, setUsers] = useState<IUser | null>(null);
    const [error, setError] = useState<string>('');
    const [posts, setPosts] = useState<IPublicPost[] | []>([])
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [isOwner, setIsOwner] = useState<boolean>(false);

    // Fetching User
    useEffect(() => {
        userService.getProfile(params.username as string)
            .then((res) => {
                console.log(res.data.user)
                setUsers(res.data.user)
                setIsOwner(res.data.isOwner)
            })
            .catch((error) => {
                console.log('This is a test error: ' + error)
                setError(getErrorMessage(error))
            })
    }, [params.username])

    // Fetching User Posts
    useEffect(() => {
        setLoadingPosts(true)

        if (user) {
            userService.getPosts(user.username)
                .then((res) => {
                    setPosts(res.data.posts)
                })
                .catch((error) => {
                    console.log('This is a test error: ' + error)
                    setError(getErrorMessage(error))
                })
                .finally(() => {
                    setLoadingPosts(false)
                })
        }
    }, [user])

    // Error alert
    useEffect(() => {
        if (error) console.log('This is a test error: ' + error)
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
                    // <div className="min-h-screen bg-gray-100">
                    //     <Navbar type="profile" />
                    //     <div className="md:px-20">
                    //         <CoverImage />
                    //         <ProfileHeader user={user} />
                    //         <div className="flex flex-col md:flex-row md:justify-between px-4 md:px-10 mt-2">
                    //             <div>
                    //                 <ProfileStats />
                    //             </div>
                    //         </div>
                    //         <div className="px-4 md:px-10 mt-6 max-w-2xl mx-auto">
                    //             {loadingPosts ? (
                    //                 Array.from({ length: 3 }).map((_, i) => <SkeletonPostCard key={i} />)
                    //             ) : (
                    //                 posts.map((post, index) => (
                    //                     <React.Fragment key={post._id}>
                    //                         <PostCard {...post} currentUserID={session?.user?.id as string} />
                    //                         {index !== posts.length - 1 && <div className="border-t my-4" />}
                    //                     </React.Fragment>
                    //                 ))
                    //             )}
                    //         </div>
                    //     </div>
                    // </div>
                        <div className="min-h-screen bg-gray-100">
                            <Navbar type="profile" />
                            <div className="md:px-20">
                                <CoverImage />
                                <div className="relative">
                                    <ProfileHeader user={user} />
                                    {!isOwner && (
                                        <div className="absolute top-2 right-4 md:top-4 md:right-10 flex space-x-2">
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base shadow">
                                                Follow
                                            </button>
                                            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm md:text-base shadow">
                                                Message
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col md:flex-row md:justify-between px-4 md:px-10 mt-2">
                                    <div>
                                        <ProfileStats />
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
