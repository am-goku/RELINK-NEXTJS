"use client";

import Header from '@/components/nav/header';
import { Session } from 'next-auth';
import React, { useState } from 'react';
import PostHeader from './header.post';
import PostCard from './card.post';
import Comments from './comments.post';
import { IPublicPost } from '@/utils/sanitizer/post';

type Props = {
    session: Session;
    post: IPublicPost;
    isOwner: boolean;
}

function PostClient({post, isOwner, session}: Props) {

    // Post States
    const [likes, setLikes] = useState<IPublicPost["likes"]>(post.likes || []);
    const [saves, setSaves] = useState<IPublicPost["saves"]>(post.saves || []);

    const [error, setError] = useState<string | null>(null);

    //UI States
    const [busy, setBusy] = useState(false);

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
        );

    if (!post) return null;

    return (
        <div className="min-h-screen bg-[#F0F2F5] dark:bg-neutral-900 text-[#2D3436] dark:text-gray-200 p-4">
            <Header page="explore" />

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <PostHeader session={session} post_id={post._id} />

                {/* Post Card */}
                <PostCard
                    session={session}
                    busy={busy}
                    post={post}
                    liked={likes.includes(session.user.id)}
                    saved={saves.includes(session.user.id)}
                    setLikes={setLikes}
                    setSaves={setSaves}
                    setBusy={setBusy}
                />

                {/* Comment Composer */}
                <Comments
                    session={session}
                    isPostOwner={isOwner}
                    post={post}
                    busy={busy}
                    setError={setError}
                    setBusy={setBusy}
                />

            </div>
        </div>
    );
}

export default PostClient