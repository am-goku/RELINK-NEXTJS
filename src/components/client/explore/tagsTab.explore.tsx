import apiInstance from '@/lib/axios';
import { getErrorMessage } from '@/lib/errors/errorResponse';
import { SanitizedHashtag } from '@/utils/sanitizer/hashtag';
import { ListX } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
    query: string;
    setHashtag: (tag: string) => void;
}

function TagsTab({ query, setHashtag }: Props) {

    const busyRef = useRef(false);

    const [tags, setTags] = useState<SanitizedHashtag[]>([]);
    
    const fetchTags = useCallback(async () => {
        if (busyRef.current) return; // debounce

        try {
            if (!query) {
                const res = (await apiInstance.get(`/api/hashtag?trending=true&limit=10`)).data;
                setTags(res);
                return;
            } // Fetching trending tags

            busyRef.current = true; // debounce

            const res = (await apiInstance.get(`/api/hashtag?key=${query}&limit=10`)).data; // fetching tags
            setTags(res);

        } catch (error) {
            throw (getErrorMessage(error) || "Something went wrong. Please try again.");
        } finally {
            setTimeout(() => busyRef.current = false, 500); // debounce
        }
    }, [query])

    useEffect(() => {
        console.log("Rendering TagsTab with query:", query);
        fetchTags();
    }, [fetchTags, query])

    return (
        <div className="space-y-4">
            {
                tags.length > 0 ? (
                    tags.map((t) => (
                        <button key={t._id.toString()} onClick={() => setHashtag(t.tag)} className="px-3 py-1 rounded-full bg-white/90 dark:bg-neutral-800/80 shadow-sm">#{t.tag}</button>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
                        <ListX className="w-12 h-12 mb-4" />
                        <p>No tags found</p>
                    </div>
                )
            }
        </div>
    )
}

export default TagsTab