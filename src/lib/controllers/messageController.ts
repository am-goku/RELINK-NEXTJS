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
    const usersExist = await User.exists({ _id: { $in: [c_user, receiver] } });
    if (!usersExist) throw new NotFoundError('Users not found');

    const newMessage = await Message.create({
        sender: c_user,
        receiver,
        message
    });

    return newMessage;
}

export async function getMessages(c_user: string, receiver: string) {
    await connectDB();

    const usersExist = await User.exists({ _id: { $in: [c_user, receiver] } });
    if (!usersExist) throw new NotFoundError('Users not found');

    const rawMessages = await Message.find({
        $or: [
            { sender: c_user, receiver },
            { sender: receiver, receiver: c_user }
        ]
    }).sort({ createdAt: 1 });

    // Mask deleted messages with placeholder
    const messages = rawMessages.map(msg => ({
        _id: msg._id,
        sender: msg.sender,
        receiver: msg.receiver,
        message: msg.deleted ? "This message was deleted." : msg.message,
        deleted: msg.deleted || false,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt
    }));

    return messages;
}


export async function deleteMessage(messageId: string) {
    await connectDB();

    const result = await Message.updateOne(
        { _id: messageId },
        { $set: { deleted: true } }
    );

    if (result.matchedCount === 0) {
        throw new NotFoundError('Message not found');
    }

    return result;
}