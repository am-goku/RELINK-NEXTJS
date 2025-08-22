import { Camera } from 'lucide-react'
import React from 'react'

type Props = {
    image: string
}

function ProfilePicUpdater({ image }: Props) {
    return (
        <React.Fragment>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
                    Profile Picture
                </label>
                <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image || '/images/default-profile.png'}
                        alt="profile"
                        draggable={false}
                        className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-neutral-700"
                    />
                    <button className="flex items-center gap-2 text-sm text-[#6C5CE7] hover:underline">
                        <Camera size={16} />
                        Change
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ProfilePicUpdater