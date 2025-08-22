import { followUser, unfollowUser } from '@/services/api/user-apis'
import { SanitizedUser, ShortUser } from '@/utils/sanitizer/user'
import { Types } from 'mongoose'
import React, { useCallback } from 'react'

export function FollowButton({ id, c_user, setUser, setError }: {
    id: Types.ObjectId | undefined,
    c_user: ShortUser,
    setUser: React.Dispatch<React.SetStateAction<SanitizedUser | null>>,
    setError: React.Dispatch<React.SetStateAction<string>>
}) {

    const handleClick = useCallback(() => {
        if (id) {
            followUser({ id, c_user, setUser, setError })
        }
    }, [id, setError, setUser, c_user])

    return (
        <button onClick={handleClick} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base shadow">
            Follow
        </button>
    )
}


export function UnfollowButton({ id, c_user, setUser, setError }: {
    id: Types.ObjectId | undefined,
    c_user: ShortUser,
    setUser: React.Dispatch<React.SetStateAction<SanitizedUser | null>>,
    setError: React.Dispatch<React.SetStateAction<string>>
}) {

    const handleClick = useCallback(() => {
        if (id) {
            unfollowUser({ id, c_user, setUser, setError })
        }
    }, [id, setError, setUser, c_user])

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