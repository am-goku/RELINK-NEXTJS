import { Search, X } from 'lucide-react';
import React, { useRef, useState } from 'react'

type Props = {
    setQuery: (q: string) => void;
}

function ExploreSearchBar({ setQuery }: Props) {

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [searchKey, setSearchKey] = useState<string>("");


    const KeyDownFun = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            if (searchKey) {
                setQuery(searchKey);
            }
        }
    }

    const OneKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKey(e.target.value);
        if (!e.target.value) {
            setQuery("");
        }
    }

    const clearFields = () => {
        setSearchKey("");
        setQuery("");
    }


    return (
        <div className="flex items-center gap-3 rounded-full bg-white dark:bg-neutral-800 border px-3 py-2">
            <input
                ref={inputRef}
                value={searchKey}
                onChange={OneKeyChange}
                onKeyDown={KeyDownFun}
                placeholder="Search users, tags, posts..."
                className="bg-transparent outline-none w-full text-sm text-ellipsis"
            />
            {searchKey && <button onClick={clearFields} className="text-xs px-2"><X className="h-4 w-4" /></button>}
            <Search onClick={() => setQuery(searchKey)} aria-disabled={!searchKey} className="h-4 w-4 opacity-60 cursor-pointer text-gray-600 dark:text-gray-300" />
        </div>
    )
}

export default ExploreSearchBar 