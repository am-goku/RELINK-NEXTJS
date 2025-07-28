import User from "@/models/User";
import { connectDB } from "../mongoose";
import { NotFoundError } from "../errors/ApiErrors";
import Message from "@/models/Message";

export async function createMessage(c_user: string, receiver: string, message: string) {
    await connectDB();

    if (!message.trim()) {
        throw new Error('Message content cannot be empty');
    }

    // No need to fetch full user docs, just check existence
    const users = await User.find({ _id: { $in: [c_user, receiver] } });
    if (users.length !== 2) throw new NotFoundError('One or both users not found');

    const newMessage = await Message.create({
        sender: c_user,
        receiver,
        message
    });

    return newMessage;
}

export async function getMessages(c_user: string, receiver: string, skip?: number) {
    await connectDB();

    const users = await User.find({ _id: { $in: [c_user, receiver] } });
    if (users.length !== 2) throw new NotFoundError('One or both users not found');

    const rawMessages = await Message.find({
        $or: [
            { sender: c_user, receiver },
            { sender: receiver, receiver: c_user }
        ]
    }).sort({ created_at: -1 })
        .limit(20)   // latest 20 messages
        .skip(skip || 0)  // for pagination
        .lean();

    // Mask deleted messages with placeholder
    const messages = rawMessages.map(msg => ({
        _id: msg._id,
        sender: msg.sender,
        receiver: msg.receiver,
        message: msg.deleted ? "This message was deleted." : msg.message,
        deleted: msg.deleted ?? false,
        created_at: msg.created_at,
        updated_at: msg.updated_at
    }));

    return messages;
}


export async function deleteMessage(messageId: string) {
    await connectDB();

    const deletedMessage = await Message.findOneAndUpdate(
        { _id: messageId, deleted: { $ne: true } },
        { $set: { deleted: true } },
        { new: true } // returns updated doc
    );

    if (!deletedMessage) {
        throw new NotFoundError('Message not found or already deleted');
    }

    return deletedMessage;
}