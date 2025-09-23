import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'
import apiInstance from '@/lib/axios';
import { IPublicPost } from '@/utils/sanitizer/post';
import Image from 'next/image';



type Props = {
    openModalAt: (index: number) => void;
    setImagePosts: React.Dispatch<React.SetStateAction<IPublicPost[]>>
}

function SuggestedPosts({ openModalAt, setImagePosts }: Props) {

    const [suggested, setSuggested] = useState<IPublicPost[]>([]);

    useEffect(() => {
        const fetchSuggested = async () => {
            const {suggesions} = (await apiInstance.get('/api/explore/suggested')).data || [];
            setSuggested(suggesions);
            setImagePosts(suggesions);
        }

        fetchSuggested();

        return () => {
            setSuggested([]);
        }
    }, [setImagePosts])

    return (
        <section>
            <h3 className="text-lg font-semibold mb-3">Suggested</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {suggested?.map((p, i) => (
                    <motion.button key={p._id} whileHover={{ scale: 1.03 }} onClick={() => openModalAt(i)} className="relative w-full h-48 overflow-hidden rounded-xl bg-white/80 dark:bg-neutral-800/80 shadow">
                        <Image src={p.image || ''} alt={p.content || 'image'} fill sizes="100%" property='src' loading='lazy' className="object-cover" />
                        <div className="absolute left-2 bottom-2 bg-black/50 text-white rounded-full px-2 py-1 text-xs flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> {p.author.username}
                        </div>
                    </motion.button>
                ))}
            </div>
        </section>
    )
}

export default SuggestedPosts