import apiInstance from '@/lib/axios';
import { SanitizedComment } from '@/utils/sanitizer/comment';
import { IPublicPost } from '@/utils/sanitizer/post';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Loader2, Star, User2 } from 'lucide-react';
import { Session } from 'next-auth';
import React, { useCallback, useEffect, useState } from 'react'
import CommentRelies from './replies.post';
import { getErrorMessage } from '@/lib/errors/errorResponse';
import { AnimatePresence, motion } from 'framer-motion';

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
        try {
            if (!post) return; // Post not found

            if (!commentText.trim()) {
                setError("Comment cannot be empty.");
                return;
            } // Comment cannot be empty

            setBusy(true); // Set busy state

            const newComment = (await apiInstance.post(`/api/posts/${post._id}/comments`, { content: commentText })).data;

            setComments((c) => [newComment, ...c]); // Add new comment to the list
            setCommentText(""); // Clear the comment text
        } catch (error) {
            setError(getErrorMessage(error)) // Handle error
        } finally {
            setBusy(false); // Set busy state
        }
    }


    return (
        <React.Fragment>
            <div className="mt-5">
                <h3 className="text-lg font-semibold mb-2">Comments</h3>
                <div className="space-y-2">
                    <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." className="w-full rounded-lg border p-3 text-sm outline-none bg-gray-50 dark:bg-neutral-900" rows={3} />
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
                                        <div className="font-medium flex">{c.author.username}
                                            {post.author._id === c.author._id && <span className="text-xs opacity-50 flex items-center"> &nbsp; <Star className='h-3 w-3' fill='red' /> Author</span>}
                                            {c.author._id === session?.user.id && <span className="text-xs opacity-50 flex items-center"> &nbsp; <User2 className='h-3 w-3' fill='gray' /> You</span>}
                                        </div>
                                        <div className="text-xs opacity-70">{new Date(c.created_at || '').toLocaleString(navigator.language)}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)} className="text-xs text-text-black-50 dark:text-text-white-50 flex items-center">
                                            {replyingTo === c._id ? <ArrowUpWideNarrow className='h-4 w-4' fill='black' /> : <>Reply<ArrowDownWideNarrow className='h-4 w-4' /></>}</button>
                                        {(isPostOwner || c._id === session.user.id) && <button onClick={() => { }} className="text-sm text-red-500">Delete</button>}
                                    </div>
                                </div>

                                <p className="mt-2 text-sm whitespace-pre-wrap">{c.content}</p>

                                {/* replies */}
                                <AnimatePresence initial={false}>
                                    {replyingTo === c._id && (
                                        <motion.div
                                            key="replies"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <CommentRelies
                                                p_id={post._id}
                                                c_id={c._id}
                                                replyingTo={replyingTo}
                                                setReplyingTo={setReplyingTo}
                                                c_author={c.author}
                                                p_author={post.author}
                                                replyText={replyText}
                                                setReplyText={setReplyText}
                                                setBusy={setBusy}
                                                setError={setError}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </React.Fragment>
    )
}

export default Comments
