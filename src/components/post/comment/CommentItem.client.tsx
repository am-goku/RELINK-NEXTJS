"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Reply } from "lucide-react";
import Image from "next/image";
import { SanitizedComment, SanitizedReply } from "@/utils/sanitizer/comment";
import { Button } from "@/components/ui/buttons/CommentButton";
import CommentReplyClient from "./CommentReply.client";
import { fetchReply } from "@/services/api/comment-apis";

interface CommentItemProps {
  comment: SanitizedComment;
}

function CommentItem({ comment }: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState<SanitizedReply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const handleLoadReplies = async () => {
    if (replies.length > 0) {
      setReplies([]);
      return;
    }
    setLoadingReplies(true);
    const data = await fetchReply(comment.post, comment._id);
    setReplies(data);
    setLoadingReplies(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="space-y-2"
    >
      {/* Comment Body */}
      <div className="flex items-start space-x-3">
        <Image
          src={comment?.author?.image || "/images/default-profile.png"}
          className="rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"
          width={36}
          height={36}
          alt={comment?.author?.username}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {comment?.author?.username}
            </span>{" "}
            <span className="text-gray-700 dark:text-gray-300">
              {comment?.content}
            </span>
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs ring-0 focus:ring-0"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              <Reply className="w-3.5 h-3.5 mr-1" /> Reply
            </Button>

            {
              comment.replies.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={handleLoadReplies}
                >
                  {loadingReplies ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : replies.length > 0 ? "Hide Replies" : "View Replies"}
                </Button>
              )
            }
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {showReplyInput && (
              <CommentReplyClient comment={comment} setReplies={setReplies} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Replies Section */}
      <AnimatePresence>
        {replies && replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="ml-10 border-l pl-4 space-y-3"
          >
            {replies.map((reply) => (
              <div key={reply._id} className="flex items-start space-x-2">
                <Image
                  src={reply?.author?.image || "/images/default-profile.png"}
                  className="rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"
                  width={28}
                  height={28}
                  alt={reply?.author?.username}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {reply?.author?.username}
                    </span>{" "}
                    <span className="text-gray-700 dark:text-gray-300">
                      {reply?.content}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default CommentItem;




