import ShareModal from '@/components/modal/SocialShare';
import Avatar from '@/components/template/avatar';
import LikeButton from '@/components/template/heart';
import SaveButton from '@/components/template/save';
import { DateHelper } from '@/helpers/date-helper';
import { IPublicPost } from '@/utils/sanitizer/post';
import { MessageSquare, Share2 } from 'lucide-react'
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import React from 'react'

type Props = {
    session?: Session;
    post: IPublicPost;
}

function PostPageCard({ session, post }: Props) {

    const router = useRouter();

    const [shareModalOpen, setShareModalOpen] = React.useState(false);

    async function handleShare() {
        setShareModalOpen(true);
    } // TODO: Need to add share API call


    return (
        <React.Fragment>
            <article className="rounded-2xl bg-white/90 dark:bg-neutral-800/80 p-4 shadow">
                <header className="flex items-center gap-3 mb-3">
                    <Avatar size={10} user={post.author} />
                    <div onClick={() => router.push(`/${post.author.username}`)} className='cursor-pointer'>
                        <div className="font-semibold">{post.author.name || post.author.username}</div>
                        <div className="text-xs opacity-70">@{post.author.username} • {DateHelper.formatDateLong(post.created_at)}</div>
                    </div>
                </header>

                <div className="text-sm mb-3 whitespace-pre-wrap">{post.content}</div>

                {post.image && (
                    <div className="mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.image} alt="post image" className="w-full rounded-lg object-cover max-h-[60vh]" />
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">

                        <LikeButton
                            post_id={post._id}
                            initialLiked={post.likes.includes(session?.user?.id || "")}
                            initialCount={post.likes.length}
                        />

                        <button className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5">
                            <MessageSquare className="h-4 w-4" /> <span className="text-sm">{post.comments_count}</span>
                        </button>

                        {
                            !post.disableShare ? (
                                <button onClick={handleShare} className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5">
                                    <Share2 className="h-4 w-4" /> <span className="text-sm">{post.share_count}</span>
                                </button>
                            ) : null
                        }
                    </div>

                    <div className="flex items-center gap-3">
                        <SaveButton
                            initialSaved={post.saves.includes(session?.user?.id || "")}
                            post_id={post._id}
                        />
                    </div>
                </div>
            </article>


            {
                (shareModalOpen && !post.disableShare) && (
                    <ShareModal
                        isOpen={shareModalOpen}
                        onClose={() => setShareModalOpen(false)}
                        url={window.location.href}
                        text={post.content || "Check out this post"}
                    />
                )
            }

        </React.Fragment>
    )
}

export default PostPageCard