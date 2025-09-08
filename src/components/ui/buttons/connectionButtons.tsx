import { followUser, unfollowUser } from '@/services/api/user-apis'
import { MessageSquare, UserMinus, UserPlus } from 'lucide-react';
import { Types } from 'mongoose'
import React, { useCallback } from 'react'


export function FollowButton({ id, setIsFollowing }: {
    id: Types.ObjectId | undefined;
    setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;
}) {

    const handleClick = useCallback(async () => {
        if (id) {
            await followUser({ id });
            setIsFollowing(true);
        }
    }, [id, setIsFollowing])

    return (
        <button onClick={handleClick} className="px-4 py-1 rounded-full flex items-center gap-1 bg-[#2D3436] text-white hover:brightness-110 dark:bg-gray-200 dark:text-neutral-900">
            <UserPlus size={16} /> Follow
        </button>
    )
}

export function UnfollowButton({ id, setIsFollowing }: {
    id: Types.ObjectId | undefined;
    setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;
}) {

    const handleClick = useCallback(async () => {
        if (id) {
            await unfollowUser({ id });
            setIsFollowing(false);
        }
    }, [id, setIsFollowing])

    return (
        <button onClick={handleClick} className="px-4 py-1 rounded-full flex items-center gap-1 bg-[#2D3436] text-white hover:brightness-110 dark:bg-gray-200 dark:text-neutral-900">
            <UserMinus size={16} /> Remove
        </button>
    )
}

export function MessageButton() {
    return (
        <button className="bg-gray-300 dark:bg-gray-700 px-4 py-1 rounded-full flex items-center gap-1">
            <MessageSquare size={16} /> Message
        </button>
    )
}