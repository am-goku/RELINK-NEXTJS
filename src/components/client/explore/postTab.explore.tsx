import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IPublicPost } from '@/utils/sanitizer/post';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ImageIcon, ListX } from 'lucide-react';
import apiInstance from '@/lib/axios';

type Props = {
    query: string;
    hashtag: string;
    openModalAt: (index: number) => void;
    setImagePosts: React.Dispatch<React.SetStateAction<IPublicPost[]>>
}

function PostTab({ query, hashtag, openModalAt, setImagePosts }: Props) {

    const busyRef = useRef(false);

    const [posts, setPosts] = useState<IPublicPost[]>([]);

    const fetchPosts = useCallback(async () => {
        if (busyRef.current) return;
        try {
            busyRef.current = true;

            if (hashtag) {
                const data = (await apiInstance.get(`/api/hashtag/post?tag=${hashtag}`)).data;
                setPosts(data.posts);
                setImagePosts(data.posts || []);
                return;
            }

            if (!query) {
                const { suggesions } = (await apiInstance.get('/api/explore/suggested')).data || [];
                setPosts(suggesions);
                setImagePosts(suggesions || []);
            } else {
                const data = (await apiInstance.get(`/api/hashtag/post?tag=${query}`)).data;
                setPosts(data.posts);
                setImagePosts(data.posts || []);
            }

        } catch (error) {
            console.log(error);
        } finally {
            busyRef.current = false;
        }
    }, [hashtag, query, setImagePosts]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <section>
            {posts && posts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {posts.map((p, i) => (
                        <motion.button
                            key={p._id}
                            whileHover={{ scale: 1.03 }}
                            onClick={() => openModalAt(i)}
                            className="relative w-full h-48 overflow-hidden rounded-xl bg-white/80 dark:bg-neutral-800/80 shadow"
                        >
                            {p.image && (
                                <Image
                                    src={p.image}
                                    alt={p.content || "image"}
                                    fill
                                    sizes="100%"
                                    property="src"
                                    loading="lazy"
                                    className="object-cover"
                                />
                            )}
                            <div className="absolute left-2 bottom-2 bg-black/50 text-white rounded-full px-2 py-1 text-xs flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" /> {p.author.username}
                            </div>
                        </motion.button>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
                    <ListX className="w-12 h-12 mb-4" />
                    <p>No posts found</p>
                </div>
            )}
        </section>
    )
}

export default PostTab