'use client'

import React, { useEffect, useState } from "react";
import CoverImage from "../../components/CoverImage";
import Navbar from "../../components/Navbar";
import PostCard from "../../components/PostCard";
import ProfileHeader from "../../components/ProfileHeader";
import ProfileStats from "../../components/ProfileStats";
import LoaderScreen from "../../components/loaders/LoaderScreen";
import { IPublicPost } from "../../models/Post";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/userStore";
import SkeletonPostCard from "@/components/skeletons/SkeletonPostCard";
import { API_ROUTES } from "@/constants/apiRoutes";
import apiInstance from "@/lib/axios";
import { useParams } from "next/navigation";


function Page() {

    const { data: session, status } = useSession();
    const params = useParams()
    const user = useUserStore((state) => state.user);
    const [error, setError] = useState<string>('');
    const [posts, setPosts] = useState<IPublicPost[] | []>([])
    const [loadingPosts, setLoadingPosts] = useState(true);


    // Fetching User Posts
    useEffect(() => {
        if (user) {
            setLoadingPosts(true)
            apiInstance.get(API_ROUTES.USER.GET_POSTS(params.username as string)).then((res) => {
                setPosts(res.data.posts)
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                setLoadingPosts(false)
            })
        }
    }, [user, params])

    // Error alert
    useEffect(() => {
        if (error) alert(error)

        return () => {
            setError('')
        }
    }, [error])

    if (status === 'loading') {
        return <LoaderScreen />
    }

    return (
        <React.Fragment>
            <div className="min-h-screen bg-gray-100">
                <Navbar type="profile" />
                <div className="md:px-20">
                    <CoverImage />
                    <ProfileHeader user={user} />
                    <div className="flex flex-col md:flex-row md:justify-between px-4 md:px-10 mt-2">
                        <div>
                            <ProfileStats />
                        </div>
                    </div>
                    <div className="px-4 md:px-10 mt-6 max-w-2xl mx-auto">
                        {/* {posts.map((post, index) => (
              <React.Fragment key={post._id}>
                <PostCard {...post} currentUserID={session?.user?.id as string} />
                {index !== posts.length - 1 && <div className="border-t my-4" />}
              </React.Fragment>
            ))} */}

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
