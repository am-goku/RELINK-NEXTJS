import PostOptionsModal from "@/components/modal/postOptions";
import ShareModal from "@/components/modal/SocialShare";
import { IPublicPost } from "@/utils/sanitizer/post";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";
import PostCard from "../ui/cards/postCard";

type Props = {
    hasMore: boolean;
    loading: boolean;
    posts: IPublicPost[];
    totalPages: number;
    setPage: React.Dispatch<React.SetStateAction<number>>
}

export default function PostList({ posts, hasMore, loading, totalPages, setPage }: Props) {

    const router = useRouter();

    const loaderRef = React.useRef<HTMLDivElement | null>(null);
    const parentRef = React.useRef<HTMLDivElement | null>(null);

    // Modal States [post options and share]
    const [postOptionsData, setPostOptionsData] = React.useState<{ post_id: string; author_id: string } | null>(null);
    const [shareModalData, setShareModalData] = React.useState<{ post_id: string; text: string } | null>(null);

    React.useEffect(() => {
        if (!loaderRef.current || !hasMore) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading) {
                setPage(p => p + 1);
            };
        });

        observer.observe(loaderRef.current);

        return () => observer.disconnect();

    }, [loading, hasMore, totalPages, setPage]);

    const rowVirtualizer = useVirtualizer({
        count: posts.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 550, // average post height (tuned later)
        overscan: 5,
    });


    return (
        <React.Fragment>
            <div className="grid gap-4" ref={parentRef}>
                <AnimatePresence>
                    {!loading ? (
                        <React.Fragment>
                            {rowVirtualizer.getVirtualItems().map((vr, index) => {
                                const post = posts[vr.index];
                                return (
                                    <motion.div key={post._id + index} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                        <PostCard post={post} setPostOptionsData={setPostOptionsData} setShareModalData={setShareModalData} />
                                    </motion.div>
                                )
                            })}
                            {hasMore && (
                                <motion.div ref={loaderRef} className="rounded-2xl border bg-white/80 p-4 shadow-sm ring-1 ring-black/5 dark:bg-neutral-800/70 dark:ring-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-gray-200" />
                                        <div className="flex-1">
                                            <div className="h-3 w-1/3 rounded bg-gray-200" />
                                            <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
                                        </div>
                                    </div>
                                    <div className="mt-3 h-40 rounded bg-gray-200" />
                                </motion.div>
                            )}
                        </React.Fragment>

                    ) : (
                        <div className="space-y-3">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="rounded-2xl border bg-white/80 p-4 shadow-sm ring-1 ring-black/5 dark:bg-neutral-800/70 dark:ring-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-gray-200" />
                                        <div className="flex-1">
                                            <div className="h-3 w-1/3 rounded bg-gray-200" />
                                            <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
                                        </div>
                                    </div>
                                    <div className="mt-3 h-40 rounded bg-gray-200" />
                                </div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {
                postOptionsData && (
                    <PostOptionsModal
                        key={postOptionsData.post_id}
                        open={postOptionsData !== null}
                        author_id={postOptionsData.author_id}
                        onClose={() => setPostOptionsData(null)}
                        onGoToPost={() => router.push(`/post/${postOptionsData.post_id}`)}
                    />
                )
            }

            {
                shareModalData && (
                    <ShareModal
                        isOpen={shareModalData !== null}
                        url={`${process.env.NEXT_PUBLIC_API_BASE_URL}/post/${shareModalData.post_id}`}
                        text={shareModalData.text || "Check out this post"}
                        onClose={() => setShareModalData(null)}
                    />
                )
            }

        </React.Fragment>
    )
}