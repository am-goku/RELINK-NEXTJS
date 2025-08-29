import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CommentItem from "./CommentItem.client";
import { SanitizedComment } from "@/utils/sanitizer/comment";


function CommentsPane({
  comments,
  windowSize = 5,
}: {
  comments: SanitizedComment[];
  windowSize?: number;
}) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(comments.length / windowSize));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const top = el.scrollTop <= 4;
      const bottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 4;
      setAtTop(top);
      setAtBottom(bottom);
    };

    onScroll();
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goPrev = () => {
    if (page === 0) return;
    setPage((p) => p - 1);
    // After switching to previous, optionally keep user context by scrolling near bottom
    requestAnimationFrame(() => {
      if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight - containerRef.current.clientHeight - 8;
    });
  };

  const goNext = () => {
    if (page + 1 >= pageCount) return;
    setPage((p) => p + 1);
    // After switching to next, scroll to top to mimic new window
    requestAnimationFrame(() => {
      if (containerRef.current) containerRef.current.scrollTop = 0;
    });
  };


  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/70 px-3 py-2 backdrop-blur dark:border-gray-700 dark:bg-gray-900/70">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <MessageSquare size={16} />
          <span>
            {comments.length} comment{comments.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* Scrollable window */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-y-auto p-3 space-y-4"
      >
        {/* Top affordance */}
        <AnimatePresence>
          {!atTop && page > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none sticky top-0 z-10 -mt-3 mb-2 flex justify-center"
            >
              <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <button onClick={goPrev} className="inline-flex items-center gap-1">
                  See previous
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {
            comments.length > 0 ? (
              comments.map((c) => (
                <CommentItem key={c._id} comment={c} />
              ))
            ) : (
              <div className="py-10 text-center text-sm text-gray-400">
                <p className="font-medium text-lg">No comments yet.</p>
                <p className="mt-2 text-sm">Start the conversation!</p>
              </div>
            )
          }
        </AnimatePresence>

        {/* Bottom affordance */}
        <AnimatePresence>
          {!atBottom && page + 1 < pageCount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none sticky bottom-0 z-10 -mb-3 mt-2 flex justify-center"
            >
              <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <button onClick={goNext} className="inline-flex items-center gap-1">
                  Show more
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CommentsPane;