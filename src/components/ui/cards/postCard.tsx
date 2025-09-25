import React from "react";
import Avatar from "../../template/avatar";
import { Types } from "mongoose";
import { IPublicPost } from "@/utils/sanitizer/post";
import { Heart, MessageSquare, MoreHorizontal, Share2 } from "lucide-react";
import PostOptionsModal from "@/components/modal/postOptions";
import { useRouter } from "next/navigation";
import ShareModal from "@/components/modal/SocialShare";

function PostCard({ post, onLike }: { post: IPublicPost; onLike: (id: string) => void }) {

  const router = useRouter();

  const [postOptions, setPostOptions] = React.useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <article className="rounded-2xl border bg-white/80 p-4 shadow-sm ring-1 ring-black/5 dark:bg-neutral-800/70 dark:ring-white/10">
        {/* header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <Avatar user={{ ...post.author, _id: new Types.ObjectId(post.author._id) }} size={10} />
            </div>
            <div onClick={() => { router.push(`/${post.author.username}`) }}>
              <p className="text-sm font-semibold cursor-pointer">{post.author.name}</p>
              <p className="text-xs opacity-70">@{post.author.username} • just now</p>
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
            <button
              onClick={() => onLike(post._id)}
              className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="like"
            >
              <Heart className="h-4 w-4" />
              <span className="text-xs">{post.likes_count}</span>
            </button>

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
          <div className="text-xs opacity-60 cursor-pointer">View details</div>
        </div>
      </article>

      {/* PostOptionsModal */}
      {postOptions && (
        <PostOptionsModal
          key={post._id}
          open={postOptions}
          author_id={post.author._id}
          onClose={() => setPostOptions(false)}
          onGoToPost={() => router.push(`/post/${post._id}`)}
        />
      )}

      {
        (shareModalOpen && !post.disableShare) && (
          <ShareModal
            isOpen={shareModalOpen}
            url={`${process.env.NEXT_PUBLIC_API_BASE_URL}/post/${post._id}`}
            text={post.content || "Check out this post"}
            onClose={() => setShareModalOpen(false)} />
        )
      }

    </React.Fragment>
  );
}

export default PostCard;