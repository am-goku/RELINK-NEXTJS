import React from 'react'

export function FollowButton() {
    return (
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base shadow">
            Follow
        </button>
    )
}


export function UnfollowButton() {
    return (
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base shadow">
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