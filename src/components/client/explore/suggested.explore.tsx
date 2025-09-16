import React from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'

type UserType = { id: string; name: string; username: string; avatar?: string };
type PostType = { id: string; author: UserType; text?: string; image?: string; tags?: string[] };


type Props = {
    p: PostType;
    i: number;
    openModalAt: (index: number) => void;
}

function SuggestedPosts({ p, openModalAt, i }: Props) {
    return (
        <motion.button key={p.id} whileHover={{ scale: 1.03 }} onClick={() => openModalAt(i)} className="relative overflow-hidden rounded-xl bg-white/80 dark:bg-neutral-800/80 shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.text || 'image'} className="w-full h-48 object-cover" />
            <div className="absolute left-2 bottom-2 bg-black/50 text-white rounded-full px-2 py-1 text-xs flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> {p.author.name}
            </div>
        </motion.button>
    )
}

export default SuggestedPosts