import { followUser, unfollowUser } from '@/services/api/user-apis'
import { Types } from 'mongoose'
import React, { useCallback } from 'react'

const updateConnection = ({
    setFollowers,
    type,
    setConnection,
}: {
    setFollowers: React.Dispatch<React.SetStateAction<number>>;
    type: "add" | "remove";
    setConnection: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    setFollowers((prev) => {
        if (type === "add") return prev + 1;
        if (type === "remove") return Math.max(prev - 1, 0);
        return prev;
    });

    setConnection(type === "add"); // ✅ set explicitly
};

export function FollowButton({ id, setFollowers, setIsFollowing, setError }: {
    id: Types.ObjectId | undefined;
    setFollowers: React.Dispatch<React.SetStateAction<number>>;
    setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
}) {

    const handleClick = useCallback(() => {
        if (id) {
            updateConnection({ setFollowers, type: "add", setConnection: setIsFollowing });
            followUser({
                id,
                setError,
                setFollowers,
                updateConn: updateConnection,
                setConnection: setIsFollowing
            })
        }
    }, [id, setFollowers, setIsFollowing, setError])

    return (
        <button onClick={handleClick} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base shadow">
            Follow
        </button>
    )
}


export function UnfollowButton({ id, setFollowers, setIsFollowing, setError }: {
    id: Types.ObjectId | undefined;
    setFollowers: React.Dispatch<React.SetStateAction<number>>;
    setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
}) {

    const handleClick = useCallback(() => {
        if (id) {
            updateConnection({ setFollowers, type: "remove", setConnection: setIsFollowing });
            unfollowUser({
                id,
                setError,
                setFollowers,
                updateConn: updateConnection,
                setConnection: setIsFollowing
            })
        }
    }, [id, setFollowers, setIsFollowing, setError])

    return (
        <button onClick={handleClick} className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base shadow">
            Following
        </button>
    )
}


export function MessageButton() {
    return (
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm md:text-base shadow">
            Message
        </button>
    )
}