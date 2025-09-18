import { IPublicPost } from '@/utils/sanitizer/post';
import React from 'react'

type Props = {
    resultPosts: IPublicPost[];
    openModalAt?: (index: number) => void;
}

function PostTab({ resultPosts }: Props) {

    return (
        <div className="space-y-4">
            {(Array.isArray(resultPosts) && resultPosts.length > 0) ? (
                resultPosts.map((p) => (
                    <article key={p._id} className="rounded-xl bg-white/90 dark:bg-neutral-800/80 p-4 shadow flex gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" className="w-36 h-24 object-cover rounded-md" />
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <div className="font-semibold">{p.user.name}</div>
                                <div className="text-xs opacity-70">@{p.user.username}</div>
                            </div>
                            <p className="mt-2 text-sm line-clamp-3">{p.content}</p>
                            <div className="mt-3 flex items-center gap-3 text-xs opacity-70">
                                {/* <button onClick={() => openModalAt(imagePosts.findIndex(ip => ip.id === p.id))} className="px-2 py-1 rounded-md hover:bg-black/5">View</button> */}
                                <button className="px-2 py-1 rounded-md hover:bg-black/5">Save</button>
                            </div>
                        </div>
                    </article>
                ))
            ) : (
                <div className="text-center text-sm opacity-70">No posts found</div>
            )
            }
        </div>
    )
}

export default PostTab