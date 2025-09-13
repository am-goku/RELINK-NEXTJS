import apiInstance from "@/lib/axios";
import { SanitizedReply } from "@/utils/sanitizer/comment";
import { useCallback, useEffect, useState } from "react";

type CommentRepliesProps = {
    p_id: string;
    c_id: string;
    replyingTo: string | null;
    setReplyingTo: React.Dispatch<React.SetStateAction<string | null>>;
    replyText: { [id: string]: string };
    setReplyText: React.Dispatch<React.SetStateAction<{ [id: string]: string }>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>
    setBusy: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CommentRelies({ p_id, c_id, replyingTo, setReplyingTo, replyText, setReplyText, setError, setBusy }: CommentRepliesProps) {

    const [replies, setReplies] = useState<SanitizedReply[]>([]);

    const fetchReplies = useCallback(async () => {
        const data = (await apiInstance.get(`/api/posts/${p_id}/comments/${c_id}/reply`)).data;
        setReplies(data.replies);
    }, [p_id, c_id]);

    useEffect(() => {
        fetchReplies();
    }, [fetchReplies]);


    async function postReply(commentId: string) {
        const body = (replyText[commentId] || "").trim();
        if (!body) return setError("Reply cannot be empty.");
        setBusy(true);
        await new Promise((r) => setTimeout(r, 400));
        setReplyText((r) => ({ ...r, [commentId]: "" }));
        setReplyingTo(null);
        setBusy(false);
    }

    return (
        <div className="mt-3 space-y-2 pl-4 border-l">
            {replies.map((r, i) => (
                <div key={i.toString()} className="bg-gray-50 dark:bg-neutral-900 p-2 rounded-md">
                    <div className="text-sm font-medium">{r.author.username}</div>
                    <div className="text-xs opacity-70">{new Date(r.created_at || '').toLocaleString(navigator.language)}</div>
                    <p className="mt-1 text-sm">{r.content}</p>
                </div>
            ))}

            {/* reply composer (only for main comment) */}
            {replyingTo === c_id && (
                <div className="mt-2">
                    <textarea value={replyText[c_id] || ""} onChange={(e) => setReplyText((p) => ({ ...p, [c_id]: e.target.value }))} className="w-full rounded-md border p-2 text-sm" rows={2} placeholder={`Reply to ${replyingTo}`} />
                    <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setReplyingTo(null)} className="px-3 py-1 rounded-md">Cancel</button>
                        <button onClick={() => postReply(c_id)} className="px-3 py-1 rounded-md bg-[#2D3436] text-white">Reply</button>
                    </div>
                </div>
            )}
        </div>
    )
}