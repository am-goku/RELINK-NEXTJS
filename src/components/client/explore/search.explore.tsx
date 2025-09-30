import { Search, X } from 'lucide-react';
import React, { useRef } from 'react'

type Props = {
    query: string;
    setQuery: (q: string) => void;
}

function ExploreSearchBar({ query, setQuery }: Props) {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const typingRef = useRef<boolean>(false);

    const OneKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        typingRef.current = true;
        setQuery(e.target.value);
        setTimeout(() => typingRef.current = false, 500);
    }

    const clearFields = () => {
        setQuery("");
    }

    return (
        <div className="flex items-center gap-3 rounded-full bg-white dark:bg-neutral-800 border px-3 py-2">
            <input
                ref={inputRef}
                defaultValue={query}
                onChange={OneKeyChange}
                placeholder="Search users, tags, posts..."
                className="bg-transparent outline-none w-full text-sm text-ellipsis"
            />
            {query && <button onClick={clearFields} className="text-xs px-2"><X className="h-4 w-4" /></button>}
            <Search onClick={() => setQuery(query)} aria-disabled={!query} className="h-4 w-4 opacity-60 cursor-pointer text-gray-600 dark:text-gray-300" />
        </div>
    )
}

export default ExploreSearchBar 