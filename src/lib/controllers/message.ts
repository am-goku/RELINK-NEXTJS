import Message from "@/models/Message";
import { Types } from "mongoose";

export async function getUnreadCountsForUser(userId: string) {
  const uid = new Types.ObjectId(userId);

  const rows = await Message.aggregate([
    { $match: { deleted: false, sender: { $ne: uid }, read_by: { $ne: uid } } },
    {
      $lookup: {
        from: "conversations",        // collection name
        localField: "conversation_id",
        foreignField: "_id",
        as: "conv"
      }
    },
    { $unwind: "$conv" },
    { $match: { "conv.participants": uid } }, // ensure user is a participant
    { $group: { _id: "$conversation_id", unreadCount: { $sum: 1 } } }
  ]);

  const map: Record<string, number> = {};
  rows.forEach((r) => (map[r._id.toString()] = r.unreadCount));
  return map;
}

export async function markConversationRead(conversationId: string, userId: string) {
  const convId = new Types.ObjectId(conversationId);
  const uid = new Types.ObjectId(userId);

  const res = await Message.updateMany(
    {
      conversation_id: convId,
      sender: { $ne: uid },
      read_by: { $ne: uid },
      deleted: false
    },
    { $addToSet: { read_by: uid } }
  );

  // modern driver: res.modifiedCount
  return (res.modifiedCount ?? (res as { nModified?: number }).nModified ?? 0);
}

