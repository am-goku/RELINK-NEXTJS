import { Camera } from 'lucide-react'
import React from 'react'

type Props = {
    cover: string
}

function CoverPicUpdater({ cover }: Props) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">Cover Photo</label>
            <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={cover}
                    alt="cover"
                    className="w-32 h-16 rounded-md object-cover border"
                />
                <button className="flex items-center gap-2 text-sm text-[#6C5CE7] hover:underline">
                    <Camera size={16} />
                    Change
                </button>
            </div>
        </div>
    )
}

export default CoverPicUpdater