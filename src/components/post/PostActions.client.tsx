'use client'

import React, { useState } from "react";

interface PostActionsProps {
  comments: number;
}

export default function PostActions({ comments }: PostActionsProps) {
  const [likes, setLikes] = useState(10);
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="flex space-x-6 text-gray-600 dark:text-gray-300 text-sm">
      <button
        onClick={toggleLike}
        className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <span>{liked ? "💙" : "🤍"}</span>
        <span>{likes}</span>
      </button>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <span>💬</span>
        <span>{comments}</span>
      </button>

      <div className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
        <span>🔁</span>
        <span>3</span>
      </div>
    </div>
  );
}
