import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/fields/Input'
import { SanitizedComment, SanitizedReply } from '@/utils/sanitizer/comment'
import { Button } from '@/components/ui/buttons/CommentButton'
import { Circle, Send } from 'lucide-react'
import { addReply } from '@/services/api/comment-apis'

type Props = { 
    comment: SanitizedComment;
    setReplies?: React.Dispatch<React.SetStateAction<SanitizedReply[]>>;
}

function CommentReplyClient({ comment, setReplies }: Props) {

    //Content State
    const [replyContent, setReplyContent] = useState<string>("");

    // Util states
    const [loading, setLoading] = useState<boolean>(false);

    const sendReply = async () => {
        if (!replyContent) return;
        setLoading(true);

        // API Call
        const reply = await addReply(comment.post, comment._id, replyContent);

        // Update Replies in Parent Component
        setReplies?.((prev) => [reply, ...prev]);

        // Reset States
        setLoading(false);
        setReplyContent("");
    }

    return (
        <React.Fragment>
            <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-2 flex gap-2"
            >
                <Input
                    placeholder={`Reply to @${comment?.author?.username}`}
                    className="flex-1 h-8 text-sm"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                />
                <Button disabled={loading} onClick={sendReply} size="sm" className="h-8 text-xs">
                    {loading ? <Circle className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </Button>
            </motion.div>
        </React.Fragment>
    )
}

export default CommentReplyClient