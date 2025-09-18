import apiInstance from '@/lib/axios';
import { IPublicPost } from '@/utils/sanitizer/post';
import { SanitizedUser } from '@/utils/sanitizer/user';
import { Search } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
    activeTab: "posts" | "users" | "tags";
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    setResultPosts: React.Dispatch<React.SetStateAction<IPublicPost[]>>;
    setResultUsers: React.Dispatch<React.SetStateAction<SanitizedUser[]>>;
    setResultTags: React.Dispatch<React.SetStateAction<string[]>>;
}

function ExploreSearchBar({ activeTab, setQuery, setResultPosts, setResultUsers, setResultTags }: Props) {

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [searchKey, setSearchKey] = useState<string>("");

    const clearArrays = useCallback(() => {
        setResultPosts([]);
        setResultUsers([]);
        setResultTags([]);
    }, [setResultPosts, setResultTags, setResultUsers])

    const fetchResults = useCallback(async () => {
        try {
            if (!searchKey) return;
            clearArrays();

            switch (activeTab) {
                case "posts":
                    const res = (await apiInstance.get(`/api/posts/search?searchKey=${searchKey}`)).data;
                    setResultPosts(res.posts.results);
                    break;
                case "users":
                    const res2 = (await apiInstance.get(`/api/users/search?searchKey=${searchKey}`)).data;
                    setResultUsers(res2.users);
                    break;
                case "tags":
                    const res3 = (await apiInstance.get(`/api/tags/search?searchKey=${searchKey}`)).data;
                    setResultTags(res3.tags);
                    break;
                default:
                    break;
            }
        } finally {
            inputRef.current?.focus();
            setQuery(searchKey);
        }
    }, [searchKey, clearArrays, activeTab, setResultPosts, setResultUsers, setResultTags, setQuery])

    useEffect(() => {
        if (!searchKey) return;

        const handler = setTimeout(() => {
            fetchResults();
        }, 500); // wait 500ms after typing stops

        return () => clearTimeout(handler);
    }, [searchKey, activeTab, fetchResults]);


    const KeyDownFun = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            fetchResults();
        }
    }

    const OneKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKey(e.target.value);
    }

    const clearFields = () => {
        setSearchKey("");
        setQuery("");
        clearArrays();
    }

    return (
        <div className="flex items-center gap-3 rounded-full bg-white dark:bg-neutral-800 border px-3 py-2">
            <Search className="h-4 w-4 opacity-60" />
            <input
                ref={inputRef}
                value={searchKey}
                onChange={OneKeyChange}
                onKeyDown={KeyDownFun}
                placeholder="Search users, tags, posts..."
                className="bg-transparent outline-none w-full text-sm text-ellipsis"
            />
            {searchKey && <button onClick={clearFields} className="text-xs px-2">Clear</button>}
        </div>
    )
}

export default ExploreSearchBar 