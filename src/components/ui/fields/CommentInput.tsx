import { addComment } from '@/services/api/comment-apis';
import { SanitizedComment } from '@/utils/sanitizer/comment';
import { Send } from 'lucide-react'
import React from 'react'

type Props = {
    post_id: string;
    setComments?: React.Dispatch<React.SetStateAction<SanitizedComment[]>>;
}
function CommentInput({ post_id, setComments }: Props) {

    const [replyText, setReplyText] = React.useState<string>("");

    const handleSend = async () => {
        if (replyText.trim() === "") return;
        
        const comment = await addComment({ postId: post_id, content: replyText });

        setReplyText("");

        if (setComments) setComments?.((prev) => [comment, ...prev]);
    };

    return (
        <React.Fragment>
            <div className="flex items-center gap-2">
                <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/60"
                />
                <button
                    onClick={handleSend}
                    className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-600/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label="Send reply"
                >
                    <Send size={16} />
                </button>
            </div>
        </React.Fragment>
    )
}

export default CommentInput