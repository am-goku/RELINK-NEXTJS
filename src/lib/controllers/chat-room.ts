import Message from "@/models/Message";
import { Types } from "mongoose";

export async function getUnreadCountForConversation(conversationId: string, userId: string) {
  const convId = new Types.ObjectId(conversationId);
  const uid = new Types.ObjectId(userId);

  return Message.countDocuments({
    conversation_id: convId,
    sender: { $ne: uid },         // only messages from others
    read_by: { $ne: uid },        // not yet read by this user
    deleted: false
  });
}