import React from 'react'

type Props = {
    resultTags: string[];
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    setActiveTab: React.Dispatch<React.SetStateAction<"posts" | "users" | "tags">>;
}

function TagsTab({ resultTags, setQuery, setActiveTab }: Props) {

    return (
        <div className="space-y-4">
            {
                resultTags.length > 0 ? (
                    resultTags.map((t) => (
                        <button key={t} onClick={() => { setQuery(t); setActiveTab("posts"); }} className="px-3 py-1 rounded-full bg-white/90 dark:bg-neutral-800/80 shadow-sm">#{t}</button>
                    ))
                ) : (
                    <div className="text-center text-sm opacity-70">No tags found</div>
                )
            }
        </div>
    )
}

export default TagsTab