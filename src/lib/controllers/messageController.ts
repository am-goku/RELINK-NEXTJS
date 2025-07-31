import User from "@/models/User";
import { connectDB } from "../mongoose";
import { NotFoundError } from "../errors/ApiErrors";
import Message from "@/models/Message";

/**
 * Create a new message between two users.
 * This function connects to the database and checks if both the sender and receiver exist.
 * It then creates and stores a new message document in the database.
 * Throws an error if the message content is empty or if one or both users are not found.
 *
 * @param c_user - The current user's ID (sender)
 * @param receiver - The receiver user's ID
 * @param message - The content of the message to be sent
 * @returns The newly created message document
 * @throws {Error} If the message content is empty
 * @throws {NotFoundError} If one or both users are not found
 */

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

/**
 * Retrieve a list of messages exchanged between two users.
 * This function connects to the database to fetch the latest messages between the 
 * current user and the specified receiver, ensuring both users exist before proceeding.
 * It returns messages in descending order of creation and supports pagination.
 * Deleted messages are replaced with a placeholder text.
 *
 * @param c_user - The current user's ID (sender or receiver)
 * @param receiver - The other participant's ID in the conversation
 * @param skip - Optional number of messages to skip for pagination
 * @returns An array of message objects with properties: _id, sender, receiver, 
 *          message (with placeholder if deleted), deleted status, created_at, and updated_at.
 * @throws {NotFoundError} If one or both users are not found
 */

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


/**
 * Soft delete a message by setting the deleted flag to true.
 * This function will not delete the message document from the database.
 * This function will throw a NotFoundError if the message is not found or already deleted.
 * @param messageId - The ID of the message to be deleted
 * @returns The updated message document with the deleted flag set to true.
 * @throws {NotFoundError} If the message is not found or already deleted
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