"use client";

import Header from '@/components/nav/header';
import { Session } from 'next-auth';
import React, { useState } from 'react';
import PostHeader from './header.post';
import Comments from './comments.post';
import { IPublicPost } from '@/utils/sanitizer/post';
import PostPageCard from './card.post';

type Props = {
    session: Session;
    post: IPublicPost;
    isOwner: boolean;
}

function PostClient({post, isOwner, session}: Props) {

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
                <PostPageCard
                    session={session}
                    post={post}
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