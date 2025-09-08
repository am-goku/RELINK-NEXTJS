"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, AlertCircle } from "lucide-react";
import Header from "@/components/nav/header";
import PostCard from "@/components/ui/cards/postCard";
import { fetchDashboardPosts } from "@/services/api/post-apis";
import { IPublicPost } from "@/utils/sanitizer/post";
import SuggesionsDashboard from "./suggesions.client";
import Footer from "@/components/nav/footer";
import CreatePostModal from "@/components/modal/createPost";

// Theme helper classes used across components:
// text: {text-[#2D3436] dark:text-gray-200}
// bg: {bg-light-bg/90 dark:bg-dark-bg/90 bg-[#F0F2F5] dark:bg-neutral-900}


export default function DashboardPage() {
  const [posts, setPosts] = useState<IPublicPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      {showCreateModal && (
        <CreatePostModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)} />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}


