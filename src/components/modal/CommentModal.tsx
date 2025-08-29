import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import CommentsPane from "../post/comment/CommentPane.client";
import SubPostCard from "../ui/cards/SubPostCard";
import CommentInput from "../ui/fields/CommentInput";
import { fetchComments } from "@/services/api/comment-apis";
import { IPublicPost } from "@/utils/sanitizer/post";
import { SanitizedComment } from "@/utils/sanitizer/comment";

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const panelVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.98 },
};

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    post: IPublicPost;
};

export default function PostCommentsModal({ isOpen, onClose, post }: ModalProps) {

    const [comments, setComments] = React.useState<SanitizedComment[]>([]);

    const escHandler = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;
        document.addEventListener("keydown", escHandler);
        return () => document.removeEventListener("keydown", escHandler);
    }, [escHandler, isOpen]);

    const getComments = useCallback(async () => {
        const comments = await fetchComments(post._id);
        setComments(comments);
    }, [post._id]);

    useEffect(() => {
        getComments();
    }, [getComments]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100]"
                    data-lenis-prevent
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={overlayVariants}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <motion.div
                            role="dialog"
                            aria-modal
                            aria-label="Post and comments"
                            variants={panelVariants}
                            className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-gray-900"
                        >
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full border border-gray-200 bg-white/90 p-2 text-gray-700 shadow-sm transition hover:scale-105 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-200 dark:hover:text-white"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>

                            {/* Two-pane layout */}
                            <div className="grid h-[80vh] grid-cols-1 md:h-[72vh] md:grid-cols-2">
                                {/* Left: Post */}
                                <div className="relative border-b h-full pb-14 border-gray-200 p-4 dark:border-gray-800 md:border-b-0 md:border-r">

                                    {/* Minimal post preview if no renderer is provided */}
                                    <SubPostCard user={post?.user} post={post} />

                                    {/* New message session  */}
                                    <CommentInput post_id={post._id} setComments={setComments} />
                                </div>

                                {/* Right: Comments pane */}
                                <div className="bg-red-400 pt-14 dark:bg-gray-950 overflow-auto scrollbar-none">
                                    <CommentsPane comments={comments} />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}