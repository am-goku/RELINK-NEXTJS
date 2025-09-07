"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  User,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/nav/header";
import PostCard from "@/components/ui/cards/postCard";
import { fetchDashboardPosts } from "@/services/api/post-apis";
import { IPublicPost } from "@/utils/sanitizer/post";
import SuggesionsDashboard from "./suggesions.client";
import PrimaryCreateButton from "@/components/ui/buttons/PrimaryCreateButton";

// Theme helper classes used across components:
// text: {text-[#2D3436] dark:text-gray-200}
// bg: {bg-light-bg/90 dark:bg-dark-bg/90 bg-[#F0F2F5] dark:bg-neutral-900}

type UserType = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
};


// --- Components ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Avatar({ user, size = 10 }: { user: UserType; size?: number }) {
  return (
    <div className={`h-${size} w-${size} overflow-hidden rounded-full bg-gray-200`}>
      {user.avatar ? (
        // note: tailwind dynamic class with template string for height/width won't work without plugin; we apply inline style
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatar}
          alt={user.name}
          className="h-full w-full object-cover"
          style={{ height: `${size * 4}px`, width: `${size * 4}px` }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-300">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
}



export default function DashboardPage() {
  const [posts, setPosts] = useState<IPublicPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDashboardPosts();
        if (!mounted) return;
        setPosts(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err?.message || "Unable to fetch posts.");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // optimistic like toggle (simplified)
  const handleLike = (id: string) => {
    setPosts((p) => p.map((post) => (post._id === id ? { ...post, likes: post.likes_count + 1 } : post)));
    // simulate server call
    setTimeout(() => {
      // nothing - in real app you'd confirm or rollback on failure
    }, 700);
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (payload: { text?: string; image?: string }) => {
    setCreating(true);
    setError(null);
    try {
      // simulate create
      await new Promise((r) => setTimeout(r, 800));
      const me: IPublicPost['user'] = {
        _id: "me",
        name: "You",
        username: "you",
        image: "https://i.pravatar.cc/80?img=7",
      };
      const newPost: IPublicPost = {
        _id: `p-${Date.now()}`,
        user: me,
        share_count: 0,
        comments_count: 0,
        views: 0,
        content: payload.text,
        likes_count: 0,
        image: payload.image,
        hashtags: '',
        // imageRatio: payload.image ? (Math.random() > 0.5 ? "landscape" : "square") : undefined,
        created_at: new Date(),
      };
      setPosts((s) => [newPost, ...s]);
      setShowCreateModal(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "Failed to create post.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F0F2F5] dark:bg-neutral-900 text-[#2D3436] dark:text-gray-200">
      <Header page="dashboard" doFun={handleCreateClick} />

      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-10 md:grid-cols-3">
        {/* Left column: feed */}
        <section className="md:col-span-2">
          {error && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-700/60 dark:bg-red-950/40 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex w-full flex-col gap-4">
            <div className="rounded-2xl border bg-white/80 p-4 shadow-sm ring-1 ring-black/5 dark:bg-neutral-800/70 dark:ring-white/10">
              <p className="text-sm font-semibold">Create something</p>
              <p className="mt-1 text-xs opacity-70">Share a photo, thought, or link with your followers.</p>
              <div className="mt-3 flex items-center gap-3">
                <button onClick={handleCreateClick} className="flex-1 rounded-lg border px-4 py-2 text-left text-sm opacity-80 hover:bg-black/5 dark:hover:bg-white/5">
                  What&apos;s on your mind?
                </button>
                <button onClick={handleCreateClick} className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/5">
                  <ImageIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* feed */}
            {loading ? (
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
            ) : (
              <div className="grid gap-4">
                <AnimatePresence>
                  {posts.map((post) => (
                    <motion.div key={post._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <PostCard post={post} onLike={handleLike} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        {/* Right column: sidebar */}
        <SuggesionsDashboard />
      </main>

      {/* Create modal (placeholder) */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreateModal(false)} />
            <motion.div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white/90 p-6 shadow-2xl ring-1 ring-black/5 dark:bg-neutral-800/80 dark:ring-white/10" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Create post</h3>
                <button onClick={() => setShowCreateModal(false)} className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5">✕</button>
              </div>

              <div className="mt-4 space-y-3">
                <textarea placeholder="What's happening?" id="new-post-text" className="w-full rounded-xl border px-4 py-3 text-sm outline-none" rows={4} />
                <div className="flex items-center gap-3">
                  <input id="new-post-image" placeholder="Image URL (optional)" className="flex-1 rounded-xl border px-4 py-2 text-sm outline-none" />
                  <PrimaryCreateButton onClick={async () => {
                    const textEl = document.getElementById("new-post-text") as HTMLTextAreaElement | null;
                    const imgEl = document.getElementById("new-post-image") as HTMLInputElement | null;
                    const text = textEl?.value?.trim();
                    const image = imgEl?.value?.trim();
                    await handleCreateSubmit({ text: text || undefined, image: image || undefined });
                  }} loading={creating}>Post</PrimaryCreateButton>
                </div>

                <p className="text-xs opacity-70">You can edit this modal to integrate real upload / compose flows.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-8 text-center text-xs opacity-70">
        © {new Date().getFullYear()} LinkSphere. All rights reserved.
      </footer>
    </div>
  );
}


