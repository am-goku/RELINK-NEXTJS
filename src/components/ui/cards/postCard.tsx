import React from "react";
import Avatar from "../../template/avatar";
import { IPublicPost } from "@/utils/sanitizer/post";
import { MessageSquare, MoreHorizontal, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import LikeButton from "@/components/template/heart";
import { useSession } from "next-auth/react";
import { DateHelper } from "@/helpers/date-helper";
import SaveButton from "@/components/template/save";

type Props = {
  post: IPublicPost;
  setPostOptionsData: React.Dispatch<React.SetStateAction<{ post_id: string; author_id: string } | null>>;
  setShareModalData: React.Dispatch<React.SetStateAction<{ post_id: string; text: string } | null>>;
}

function PostCard({ post, setPostOptionsData, setShareModalData }: Props) {

  const router = useRouter();

  const { data: session } = useSession();

  const liked = post.likes.includes(session?.user?.id || "") || false;

  const setPostOptions = (open: boolean) => {
    if (open) {
      setPostOptionsData({ post_id: post._id, author_id: post.author._id });
    } else {
      setPostOptionsData(null);
    }
  };

  const setShareModalOpen = (open: boolean) => {
    if (open) {
      setShareModalData({ post_id: post._id, text: post.content || "" });
    } else {
      setShareModalData(null);
    }
  };

  return (
    <React.Fragment>
      <article className="rounded-2xl border bg-white/80 p-4 shadow-sm ring-1 ring-black/5 dark:bg-neutral-800/70 dark:ring-white/10">
        {/* header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <Avatar user={post.author} size={10} />
            </div>
            <div onClick={() => { router.push(`/${post.author.username}`) }}>
              <p className="text-sm font-semibold cursor-pointer">{post.author.name}</p>
              <p className="text-xs opacity-70">@{post.author.username} • {DateHelper.formatDateLong(post.created_at)}</p>
            </div>
          </div>
          <button onClick={() => setPostOptions(true)} className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/5">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* body */}
        {post.content && <p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed">{post.content}</p>}

        {post.image && (
          <div className={`mb-3 overflow-hidden rounded-xl bg-black/5 dark:bg-white/5`}>
            {/* handle different ratios */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.content ? post.content.slice(0, 60) : `image-${post._id}`}
              loading="lazy"
              className={`w-full object-cover transition-transform hover:scale-105 ${post.imageRatio === "landscape"
                ? "aspect-[16/9]"
                : post.imageRatio === "portrait"
                  ? "aspect-[3/4]"
                  : "aspect-square"
                }`}
              style={{ maxHeight: 800 }}
            />
          </div>
        )}

        {/* actions */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">

            <LikeButton post_id={post._id} initialLiked={liked} initialCount={post.likes_count} key={post._id + "-like"} />

            <button onClick={() => { router.push(`/post/${post._id}`) }} className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/5" aria-label="comment">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{post.comments_count}</span>
            </button>

            {
              !post.disableShare ? (
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/5"
                  aria-label="share"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs">{post.share_count}</span>
                </button>
              ) : null
            }

          </div>
          <SaveButton
            initialSaved={post.saves.includes(session?.user?.id || "")}
            post_id={post._id}
          />
        </div>
      </article>
    </React.Fragment>
  );
}

export default React.memo(PostCard);