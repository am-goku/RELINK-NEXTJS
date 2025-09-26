import React from 'react'
import SkeletonPostCard from '@/components/ui/skeleton/SkeletonPostCard'
import { IPublicPost } from '@/utils/sanitizer/post';
import PostCard from '@/components/ui/cards/postCard';
import PostOptionsModal from '@/components/modal/postOptions';
import ShareModal from '@/components/modal/SocialShare';
import { useRouter } from 'next/navigation';

type Props = {
    loadingPosts: boolean;
    posts: IPublicPost[];
}

function PostList({ loadingPosts, posts }: Props) {

    const router = useRouter();

    // Modal States [post options and share]
    const [postOptionsData, setPostOptionsData] = React.useState<{ post_id: string; author_id: string } | null>(null);
    const [shareModalData, setShareModalData] = React.useState<{ post_id: string; text: string } | null>(null);


    return (
        <React.Fragment>
            <div className="space-y-4">
                {loadingPosts ? (
                    Array.from({ length: 3 }).map((_, i) => <SkeletonPostCard key={i} />)
                ) : (
                    posts.map((post, index) => (
                        <React.Fragment key={post._id}>
                            <PostCard setShareModalData={setShareModalData} setPostOptionsData={setPostOptionsData} post={post} />
                            {index !== posts.length - 1 && (
                                <div className="border-t border-gray-200 dark:border-gray-700 my-4 transition-colors" />
                            )}
                        </React.Fragment>
                    ))
                )}
            </div>


            {
                postOptionsData && (
                    <PostOptionsModal
                        key={postOptionsData.post_id}
                        open={postOptionsData !== null}
                        author_id={postOptionsData.author_id}
                        onClose={() => setPostOptionsData(null)}
                        onGoToPost={() => router.push(`/post/${postOptionsData.post_id}`)}
                    />
                )
            }

            {
                shareModalData && (
                    <ShareModal
                        isOpen={shareModalData !== null}
                        url={`${process.env.NEXT_PUBLIC_API_BASE_URL}/post/${shareModalData.post_id}`}
                        text={shareModalData.text || "Check out this post"}
                        onClose={() => setShareModalData(null)}
                    />
                )
            }
        </React.Fragment>
    )
}

export default PostList