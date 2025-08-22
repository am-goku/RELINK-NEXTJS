'use client'

import React, { useState, useRef, useEffect } from 'react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import Image from "next/image";
import { IPublicPost } from '@/utils/sanitizer/post';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PostCard({ _id, comments_count, created_at, currentUserID, hashtags, likes_count, share_count, user, views, content, image }: IPublicPost & { currentUserID: string }) {
  const [expanded, setExpanded] = useState(false);
  const [likes, setLikes] = useState(10);
  const [liked, setLiked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isOwnPost = user?._id === currentUserID;

  return (
    <React.Fragment>
      <div
        id={`${_id}`}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 w-full relative transition-colors"
      >
        {/* User Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src={user?.image || "/images/default-profile.png"}
                alt={user?.name || "User"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                {user?.name || user?.username}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                @{user?.username}
              </p>
            </div>
          </div>

          {/* Ellipsis Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            >
              <EllipsisHorizontalIcon className="w-6 h-6" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 transition-colors">
                <ul className="text-sm text-gray-700 dark:text-gray-200">
                  {isOwnPost ? (
                    <>
                      <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        Delete
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        Archive
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        Report
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        Block
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Image */}
        {image && (
          <div className="relative w-full h-60 mb-4 rounded-md overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md z-0" />
            )}
            <Image
              src={image}
              alt="Post image"
              fill
              onLoad={() => setImageLoaded(true)}
              style={{ objectFit: "cover" }}
              className={`rounded-md transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                }`}
            />
          </div>
        )}

        {/* Content */}
        <p className="text-gray-800 dark:text-gray-100 mb-3 whitespace-pre-line">
          {content}
        </p>

        {/* Actions */}
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
            <span>{comments_count}</span>
          </button>

          <div className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
            <span>🔁</span>
            <span>3</span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
