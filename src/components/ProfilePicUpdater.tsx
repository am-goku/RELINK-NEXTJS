import { Camera } from 'lucide-react'
import React from 'react'

type Props = {
    image: string
}

function ProfilePicUpdater({ image }: Props) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">Profile Picture</label>
            <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={image || '/images/default-profile.jpg'}
                    alt="profile"
                    className="w-16 h-16 rounded-full object-cover border"
                />
                <button className="flex items-center gap-2 text-sm text-[#6C5CE7] hover:underline">
                    <Camera size={16} />
                    Change
                </button>
            </div>
        </div>
    )
}

export default ProfilePicUpdater