import apiInstance from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors/errorResponse";
import { SanitizedComment, SanitizedReply } from "@/utils/sanitizer/comment";
import { IPublicPost } from "@/utils/sanitizer/post";
import { Star, User2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

type CommentRepliesProps = {
    p_id: string;
    c_id: string;
    replyingTo: string | null;
    c_author: SanitizedComment["author"];
    p_author: IPublicPost["author"];
    setReplyingTo: React.Dispatch<React.SetStateAction<string | null>>;
    replyText: { [id: string]: string };
    setReplyText: React.Dispatch<React.SetStateAction<{ [id: string]: string }>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>
    setBusy: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CommentRelies({ p_id, c_id, replyingTo, setReplyingTo, c_author, p_author, replyText, setReplyText, setError, setBusy }: CommentRepliesProps) {

    const { data: session } = useSession();

    const [replies, setReplies] = useState<SanitizedReply[]>([]);

    const fetchReplies = useCallback(async () => {
        const res = (await apiInstance.get(`/api/posts/${p_id}/comments/${c_id}/reply`)).data;
        setReplies(res);
    }, [p_id, c_id]);

    useEffect(() => {
        fetchReplies();

        return () => {
            setReplies([]);
        }
    }, [fetchReplies]);


    async function postReply(commentId: string) {
        try {
            const body = (replyText[commentId] || "").trim();
            if (!body) {
                setError("Reply cannot be empty.");
                return;
            } // Reply cannot be empty

            setBusy(true); // Set busy state

            const reply = (await apiInstance.post(`/api/posts/${p_id}/comments/${commentId}/reply`, { content: body })).data;
            setReplies((r) => [reply, ...r]); // Add reply

            setReplyText((r) => ({ ...r, [commentId]: "" })); // Clear reply
            setReplyingTo(null); // Clear replying to
        } catch (error) {
            setError(getErrorMessage(error)); // Handle error
        } finally {
            setBusy(false); // Set busy state
        }
    }

    return (
        <div className="mt-3 space-y-2 pl-4 border-l">
            {/* reply composer (only for main comment) */}
            {replyingTo === c_id && (
                <div className="mt-2">
                    <textarea value={replyText[c_id] || ""} onChange={(e) => setReplyText((p) => ({ ...p, [c_id]: e.target.value }))} className="w-full rounded-md border p-2 text-sm bg-gray-50 dark:bg-neutral-900" rows={2} placeholder={`Reply to @${c_author.username}`} />
                    <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setReplyingTo(null)} className="px-3 py-1 rounded-md">Cancel</button>
                        <button onClick={() => postReply(c_id)} className="px-3 py-1 rounded-md bg-[#2D3436] text-white">Reply</button>
                    </div>
                </div>
            )}
            <hr />
            {replies.map((r, i) => (
                <div key={i.toString()} className="bg-gray-50 dark:bg-neutral-900 p-2 rounded-md">
                    <div className="text-sm font-medium flex">{r.author.username}
                        {p_author._id === r.author._id && <span className="text-xs opacity-50 flex items-center"> &nbsp; <Star className='h-3 w-3' fill='red' /> Author</span>}
                        {r.author._id === session?.user.id && <span className="text-xs opacity-50 flex items-center"> &nbsp; <User2 className='h-3 w-3' fill='gray' /> You</span>}
                    </div>
                    <div className="text-xs opacity-70">{new Date(r.created_at || '').toLocaleString(navigator.language)}</div>
                    <p className="mt-1 text-sm">{r.content}</p>
                </div>
            ))}
        </div>
    )
}