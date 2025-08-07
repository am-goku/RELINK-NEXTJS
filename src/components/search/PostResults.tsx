import React from 'react'

type Props = {
    query: string
}

// const mockPosts = Array.from({ length: 12 }, (_, i) => ({
//     id: i + 1,
//     imageUrl: '/images/bannerImg.jpg',
// }));

const mockPosts: { id: number, imageUrl: string }[] = [];

function PostResults({ query }: Props) {
    return (
        <>
            <section>
                {
                    mockPosts.length > 0 ? (
                        <>
                            <h2 className="text-lg font-medium mb-4">Trending Posts</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {mockPosts.map((post) => (
                                    <div key={post.id} className="relative group overflow-hidden rounded-xl shadow-sm">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={post.imageUrl}
                                            alt={`Post ${post.id}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <p className="text-center text-gray-500 mt-10">No posts found for “{query}”</p>
                        </div>
                    )
                }
            </section>
        </>
    )
}

export default PostResults