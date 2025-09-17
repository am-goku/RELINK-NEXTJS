import { Search } from 'lucide-react';
import React, { useRef } from 'react'

type Props = {
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveTab: React.Dispatch<React.SetStateAction<"posts" | "users" | "tags">>;
}

function ExploreSearchBar({ query, setActiveTab, setQuery, setShowSuggestions }: Props) {

    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className="flex items-center gap-3 rounded-full bg-white dark:bg-neutral-800 border px-3 py-2">
            <Search className="h-4 w-4 opacity-60" />
            <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); setActiveTab("posts"); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Search users, tags, posts..."
                className="bg-transparent outline-none w-full text-sm text-ellipsis"
            />
            {query && <button onClick={() => setQuery("")} className="text-xs px-2">Clear</button>}
        </div>
    )
}

export default ExploreSearchBar