import Image from "next/image";

type Post = {
    _id: string;
    user: { name: string; image?: string };
    content?: string;
    image?: string | null;
};

function SubPostCard({ user, post }: {
    user: { name: string; username: string; image: string };
    post: Post;
}) {
    return (

        <div className="h-full overflow-y-auto pr-2">
            {/* Minimal post preview if no renderer is provided */}
            <div className="flex items-center gap-3">
                <Image
                    src={user.image}
                    alt="user avatar"
                    width={40} height={40}
                    className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
            </div>
            {post?.image && (
                <div className="mt-4 overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post?.image} alt="post image" className="w-full object-cover" />
                </div>
            )}
            <p className="mt-4 whitespace-pre-line text-gray-800 dark:text-gray-100">
                {post?.content}
            </p>
        </div>
    )
}

export default SubPostCard;