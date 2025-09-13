import apiInstance from '@/lib/axios';
import { SanitizedComment } from '@/utils/sanitizer/comment';
import { IPublicPost } from '@/utils/sanitizer/post';
import { Loader2 } from 'lucide-react';
import { Session } from 'next-auth';
import React, { useCallback, useEffect, useState } from 'react'
import CommentRelies from './replies.post';

type Props = {
    session: Session;
    post: IPublicPost;
    busy: boolean;
    isPostOwner: boolean;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    setBusy: React.Dispatch<React.SetStateAction<boolean>>;
}
function Comments({ session, post, busy, isPostOwner, setError, setBusy }: Props) {

    // Comment List
    const [comments, setComments] = useState<SanitizedComment[]>([]);

    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState<{ [commentId: string]: string }>({});
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const getComments = useCallback(async () => {
        const comments = (await apiInstance.get(`/api/posts/${post._id}/comments`)).data;
        setComments(comments.comments);
    }, [post._id]); // Function to fetch comments

    useEffect(() => {
        getComments();
    }, [getComments]); // Fetch comments when the component mounts

    async function postComment() {
        if (!post) return;
        if (!commentText.trim()) return setError("Comment cannot be empty.");
        setBusy(true);
        await new Promise((r) => setTimeout(r, 500));
        const newComment: SanitizedComment = {
            _id: `c-${Date.now()}`,
            post: post._id,
            author: { _id: "You", name: "You", username: "You" },
            content: commentText.trim(),
            created_at: new Date(),
            replies: [],
        };
        setComments((c) => [...c, newComment]);
        setCommentText("");
        setBusy(false);
    }


    return (
        <React.Fragment>
            <div className="mt-5">
                <h3 className="text-lg font-semibold mb-2">Comments</h3>
                <div className="space-y-2">
                    <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." className="w-full rounded-lg border p-3 text-sm outline-none" rows={3} />
                    <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setCommentText(""); setError(null); }} className="px-3 py-2 rounded-md">Cancel</button>
                        <button onClick={postComment} disabled={busy} className="px-4 py-2 rounded-md bg-[#2D3436] text-white">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Comment"}</button>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="mt-6 space-y-4">
                {comments.map((c) => (
                    <div key={c._id} className="bg-white/80 dark:bg-neutral-800/70 p-3 rounded-lg">
                        <div className="flex items-start gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={c.author.image} alt={c.author.username} className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{c.author.username}</div>
                                        <div className="text-xs opacity-70">{new Date(c.created_at || '').toLocaleString(navigator.language)}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)} className="text-sm text-blue-600">Reply</button>
                                        {(isPostOwner || c._id === session.user.id) && <button onClick={() => { }} className="text-sm text-red-500">Delete</button>}
                                    </div>
                                </div>

                                <p className="mt-2 text-sm whitespace-pre-wrap">{c.content}</p>

                                {/* replies */}
                                <CommentRelies
                                    p_id={post._id}
                                    c_id={c._id}
                                    replyingTo={replyingTo}
                                    setReplyingTo={setReplyingTo}
                                    replyText={replyText}
                                    setReplyText={setReplyText}
                                    setBusy={setBusy}
                                    setError={setError}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </React.Fragment>
    )
}

export default Comments
