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
                        if (e.key === 'Enter') {
                            const query = searchQuery.trim();
                            if (query) {
                                window.location.href = `/search?q=${encodeURIComponent(query)}`;
                            }
                        }
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F0F2F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] placeholder-[#636E72]"
                />
                <Search className="absolute top-3 left-3 text-[#636E72]" size={20} />

                {searchQuery.trim() !== '' && (
                    <SearchResult searchKey={searchQuery} />
                )}
            </div>
        </React.Fragment>
    )
}

export default SearchBar