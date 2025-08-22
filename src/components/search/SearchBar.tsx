'use client'

import { Search } from 'lucide-react';
import React, { useState } from 'react'
import SearchResult from './SearchResult';

type Props = {
    searchKey?: string;
    // onKeyChange: (key: string) => void;
}

function SearchBar({ searchKey }: Props) {

    const [searchQuery, setSearchQuery] = useState('');

    return (
        <React.Fragment>
            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Search users, posts, tags..."
                    defaultValue={searchQuery || searchKey}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const query = searchQuery.trim();
                            if (query) {
                                window.location.href = `/search?q=${encodeURIComponent(query)}`;
                            }
                        }
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl
               bg-gray-100 dark:bg-neutral-800
               text-gray-900 dark:text-gray-100
               placeholder-gray-500 dark:placeholder-gray-400
               text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
                <Search className="absolute top-3 left-3 text-gray-500 dark:text-gray-400" size={20} />

                {searchQuery.trim() !== "" && <SearchResult searchKey={searchQuery} />}
            </div>
        </React.Fragment>
    )
}

export default SearchBar