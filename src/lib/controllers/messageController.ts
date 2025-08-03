import User from "@/models/User";
import { connectDB } from "../mongoose";
import { NotFoundError } from "../errors/ApiErrors";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import { Types } from "mongoose";
import { sanitizeMessage } from "@/utils/sanitizer/message";



export async function createMessage(c_user: string, receiver: string, message: string) {
    await connectDB();

    if (!message.trim()) {
        throw new Error('Message content cannot be empty');
    }

    // No need to fetch full user docs, just check existence
    const users = await User.find({ _id: { $in: [c_user, receiver] } });
    if (users.length !== 2) throw new NotFoundError('One or both users not found');

    //Sort participant IDs to ensure consistent lookup
    const participants = [c_user, receiver].sort();

    //Check for existing 1-to-1 conversation
    let conversation = await Conversation.findOne({
        participants,
        is_group: false
    });

    // Create conversation if not exists
    if(!conversation) {
        conversation = await Conversation.create({
            participants,
            is_group: false,
        });
    }

    // Create new message linked to the conversation
    const newMessage = await Message.create({
        conversation_id: conversation?._id,
        sender: c_user,
        text: message,
    }, { new: true });

    // Optionally update last_message field in Conversation
    conversation.last_message = {
        text: message,
        sender_id: new Types.ObjectId(c_user),
        created_at: new Date()
    }
    await conversation.save();

    return sanitizeMessage(newMessage);
}



export async function getMessages(c_user: string, receiver: string, skip?: number) {
    await connectDB();

    // Confirm both users exist
    const users = await User.find({ _id: { $in: [c_user, receiver] } });
    if (users.length !== 2) throw new NotFoundError('One or both users not found');

    // Sort participant IDs for consistent query
    const participants = [c_user, receiver].sort();

    // Find the existing conversation
    const conversation = await Conversation.findOne({
        participants,
        is_group: false
    });

    if(!conversation) {
        return []; // No message if conversation does't exist
    }

    // Fetch messages by conversation_id
    const rawMessages = await Message.find({
        conversation_id: conversation._id
    })
        .sort({ created_at: -1 })
        .limit(20)   // latest 20 messages
        .skip(skip || 0)  // for pagination
        .lean();

    // Format/Mask deleted messages with placeholder
    const messages = rawMessages.map(sanitizeMessage);

    return messages;
}



export async function deleteMessage(userId: string, messageId: string) {
    await connectDB();

    const deletedMessage = await Message.findOneAndUpdate(
        { _id: messageId, sender: userId, deleted: { $ne: true } },
        { $set: { deleted: true } },
        { new: true } // returns updated doc
    );

    if (!deletedMessage) {
        throw new NotFoundError('Message not found or already deleted');
    }

    return deletedMessage;
}