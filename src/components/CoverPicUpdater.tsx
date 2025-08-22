import { Camera } from 'lucide-react'
import React from 'react'

type Props = {
    cover: string
}

function CoverPicUpdater({ cover }: Props) {
    return (
        <React.Fragment>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
                    Cover Photo
                </label>
                <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={cover || '/images/default-cover.png'}
                        draggable={false}
                        alt="cover"
                        className="w-32 h-16 rounded-md object-cover border border-gray-300 dark:border-neutral-700"
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

export default CoverPicUpdater