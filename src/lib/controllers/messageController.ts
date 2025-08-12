import User from "@/models/User";
import { connectDB } from "../db/mongoose";
import { NotFoundError } from "../errors/ApiErrors";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import { Types } from "mongoose";
import { sanitizeMessage } from "@/utils/sanitizer/message";


/**
 * Creates a new message between two users.
 * Ensures that both users exist, and a conversation between them exists.
 * If the conversation does not exist, it will be created.
 * The last_message field in the conversation will be updated, if the conversation exists.
 * @param c_user - The current user's ID
 * @param receiver - The user to receive the message's ID
 * @param message - The text content of the message
 * @returns The newly created message document, sanitized according to the current user's role
 * @throws {NotFoundError} If one or both users are not found
 * @throws {Error} If the message content is empty
 */
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
    if (!conversation) {
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



/**
 * Retrieves a list of messages between two users.
 * 
 * Connects to the database and fetches messages associated with the conversation
 * between the current user and the receiver. Messages are sorted by creation date
 * in descending order and paginated based on the provided skip value.
 * Deleted messages are masked with a placeholder text.
 * 
 * @param c_user - The current user's ID.
 * @param receiver - The receiver user's ID.
 * @param skip - The number of messages to skip for pagination, defaults to 0.
 * @returns An array of sanitized message objects.
 * @throws {NotFoundError} If one or both users are not found.
 */
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

    if (!conversation) {
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



/**
 * Deletes a message by updating its `deleted` field to `true`.
 * 
 * Connects to the database and finds the message by ID.
 * If the message is found and is not already deleted, the `deleted` field is updated to `true`.
 * 
 * @param userId - The unique identifier of the user that sent the message to be deleted.
 * @param messageId - The unique identifier of the message to be deleted.
 * @returns A sanitized version of the deleted message object.
 * @throws {NotFoundError} If the message is not found or is already deleted.
 */
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