'use client'

import React from "react";
import { IPublicPost } from "@/utils/sanitizer/post";
import PostHeader from "./PostHeader.client";
import PostImage from "./PostImage.client";
import PostActions from "./PostActions.client";

export default function PostCard({
  _id,
  comments_count,
  currentUserID,
  user,
  content,
  image,
}: IPublicPost & { currentUserID: string }) {
  return (
    <div
      id={`${_id}`}
      className="bg-white dark:bg-gray-800 md:p-4 p-2 rounded-lg shadow-md mb-6 w-full relative transition-colors"
    >
      <PostHeader user={user} currentUserID={currentUserID} />
      {image && <PostImage src={image} />}
      <p className="text-gray-800 dark:text-gray-100 mb-3 whitespace-pre-line">
        {content}
      </p>
      <PostActions comments={comments_count} />
    </div>
  );
}
