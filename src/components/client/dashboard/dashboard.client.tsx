"use client";

import React, { useCallback, useState } from "react";
import { Image as ImageIcon, AlertCircle } from "lucide-react";
import Header from "@/components/nav/header";
import { IPublicPost } from "@/utils/sanitizer/post";
import SuggesionsDashboard from "./suggesions.client";
import Footer from "@/components/nav/footer";
import CreatePostModal from "@/components/modal/createPost";
import apiInstance from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors/errorResponse";
import PostList from "./list.dashboard";

type Props = {
  initialPosts: IPublicPost[];
  totalPages: number;
  initialHasMore: boolean;
}

export default function DashboardPage({ initialPosts, totalPages, initialHasMore }: Props) {

  // Post States
  const [posts, setPosts] = useState<IPublicPost[]>(initialPosts || []);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Pagination States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore || false);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    try {
      const data = (await apiInstance.get(`/api/posts?page=${page}`)).data;
      setPosts(prev => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage(data.page);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]); // Function to fetch posts

  React.useEffect(() => {
    if (page === 1) return;
    fetchPosts();
  }, [page, fetchPosts]);

  return (
    <div className="min-h-screen w-full bg-[#F0F2F5] dark:bg-neutral-900 text-[#2D3436] dark:text-gray-200">
      <Header page="dashboard" doFun={() => setShowCreateModal(true)} />

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
                <button onClick={() => setShowCreateModal(true)} className="flex-1 rounded-lg border px-4 py-2 text-left text-sm opacity-80 hover:bg-black/5 dark:hover:bg-white/5">
                  What&apos;s on your mind?
                </button>
                <button onClick={() => setShowCreateModal(true)} className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/5">
                  <ImageIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* feed */}
            <PostList
              posts={posts}
              loading={loading}
              hasMore={hasMore}
              totalPages={totalPages}
              setPage={setPage}
            />
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


