import React from 'react'
import SkeletonPostCard from '@/components/ui/skeleton/SkeletonPostCard'
import { IPublicPost } from '@/utils/sanitizer/post';
import PostCard from '@/components/ui/cards/postCard';

type Props = {
    loadingPosts: boolean;
    posts: IPublicPost[];
}

function PostList({loadingPosts, posts}: Props) {
    return (
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
    )
}

export default PostList