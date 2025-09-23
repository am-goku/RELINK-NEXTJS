import Avatar from '@/components/template/avatar';
import { IPublicPost } from '@/utils/sanitizer/post';
import { Bookmark, Heart, MessageSquare, Share2 } from 'lucide-react'
import { Types } from 'mongoose';
import { Session } from 'next-auth';
import React from 'react'

type Props = {
    session: Session;
    post: IPublicPost;
    busy: boolean;
    liked: boolean;
    saved: boolean;
    setLikes: React.Dispatch<React.SetStateAction<IPublicPost['likes']>>;
    setSaves: React.Dispatch<React.SetStateAction<IPublicPost['saves']>>;
    setBusy: React.Dispatch<React.SetStateAction<boolean>>;
}

function PostPageCard({ session, busy, post, liked, saved, setLikes, setSaves, setBusy }: Props) {

    async function toggleLike() {
        if (!post) return;
        setBusy(true);
        await new Promise((r) => setTimeout(r, 400));
        setLikes((s) => {
            const userId = session.user.id;
            if (liked) {
                return s.filter(id => id !== userId);
            } else {
                return [...s, userId];
            }
        });
        setBusy(false);
    } // TODO: Need to add like\unlike API call

    async function toggleSave() {
        if (!post) return;
        setBusy(true);
        await new Promise((r) => setTimeout(r, 300));
        setSaves((s) => {
            const userId = session.user.id;
            if (saved) {
                return s.filter(id => id !== userId);
            } else {
                return [...s, userId];
            }
        })
        setBusy(false);
    } // TODO: Need to add save\unsave API call

    async function handleShare() {
        if (!post) return;
        setBusy(true);
        await new Promise((r) => setTimeout(r, 400));
        setBusy(false);
        // alert("Post shared (mock)");
    } // TODO: Need to add share API call

    return (
        <article className="rounded-2xl bg-white/90 dark:bg-neutral-800/80 p-4 shadow">
            <header className="flex items-center gap-3 mb-3">
                {/* <img src={post.author.image} alt={post.author.username} className="w-10 h-10 rounded-full object-cover" /> */}
                <Avatar size={10} user={{ ...post.author, _id: new Types.ObjectId(post.author._id) }} />
                <div>
                    <div className="font-semibold">{post.author.name || post.author.username}</div>
                    <div className="text-xs opacity-70">@{post.author.username} • {new Date(post.created_at).toLocaleDateString()}</div>
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
                    <button onClick={toggleLike} disabled={busy} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${liked ? "bg-red-600 text-white" : "hover:bg-black/5 dark:hover:bg-white/5"}`}>
                        <Heart className="h-4 w-4" /> <span className="text-sm">{post.likes.length + (liked ? 1 : 0)}</span>
                    </button>

                    <button className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5">
                        <MessageSquare className="h-4 w-4" /> <span className="text-sm">{post.comments_count}</span>
                    </button>

                    <button onClick={handleShare} className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5">
                        <Share2 className="h-4 w-4" /> <span className="text-sm">{post.share_count}</span>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={toggleSave} className={`p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 ${saved ? "bg-gray-200 dark:bg-gray-600" : ""}`}>
                        <Bookmark className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </article>
    )
}

export default PostPageCard