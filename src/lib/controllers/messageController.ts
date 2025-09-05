import User from "@/models/User";
import { connectDB } from "../db/mongoose";
import { NotFoundError } from "../errors/ApiErrors";
import Message, { IMessage } from "@/models/Message";
import Conversation, { IConversationPopulated } from "@/models/Conversation";
import { Types } from "mongoose";


/**
 * Retrieves a sanitized user object from the given user_id.
 * 
 * Connects to the database and fetches a user document based on the provided user_id.
 * The user object is populated with the _id, username, image and name fields and sanitized
 * before being returned.
 * 
 * @param {string} user_id - The ID of the user to be fetched.
 * @returns {Promise<IConversationPopulated["participants"][number]>} A sanitized version of the user object, containing only the fields permitted by the user's role.
 * @throws {NotFoundError} If the user is not found.
 */
export async function getConversationUser(user_id: string): Promise<IConversationPopulated["participants"][number]> {
    await connectDB();

    const receiver = await User.findById(new Types.ObjectId(user_id))
        .select('_id username image name').lean<IConversationPopulated["participants"][number]>();

    if (!receiver) throw new NotFoundError("No user found");

    return receiver;
}

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
    });

    // Optionally update last_message field in Conversation
    conversation.last_message = {
        text: message,
        sender: new Types.ObjectId(c_user),
        created_at: new Date()
    }
    await conversation.save();

    await conversation.populate("participants", "name avatar");

    return { messageData: newMessage, conversation };
}

/**
 * Creates a new message in a conversation.
 *
 * Connects to the database and checks if the conversation exists and the user is a participant.
 * If so, creates a new message in the conversation with the given content.
 * Optionally updates the last_message field in the conversation.
 * Returns the sanitized message object.
 * @throws {NotFoundError} If the conversation is not found or the user is not a participant
 * @throws {Error} If the message content is empty
 */
export async function createMessageInConversation(
    conversationId: string,
    c_user: string,
    message: string
) {
    await connectDB();

    if (!message.trim()) {
        throw new Error("Message content cannot be empty");
    }

    // Make sure conversation exists and user is a participant
    const conversation = await Conversation.findOne({
        _id: new Types.ObjectId(conversationId),
        participants: new Types.ObjectId(c_user),
    });

    if (!conversation) {
        throw new NotFoundError("Conversation not found or access denied");
    }

    // Create the new message
    const newMessage = await Message.create({
        conversation_id: conversation._id,
        sender: new Types.ObjectId(c_user),
        text: message,
    });

    // Update last_message in conversation for quick access
    conversation.last_message = {
        text: message,
        sender_id: new Types.ObjectId(c_user),
        created_at: new Date(),
    };
    await conversation.save();

    return newMessage;
}

/**
 * Retrieves messages in a conversation.
 * 
 * Connects to the database and finds a conversation with the given ID,
 * if the current user is a participant in the conversation.
 * Then, it fetches the newest 20 messages in that conversation,
 * skipping the first `skip` messages.
 * The messages are sanitized according to the current user's role.
 * 
 * @param c_user - The current user's ID
 * @param conversationId - The ID of the conversation to retrieve messages from
 * @param skip - The number of messages to skip, from the newest, defaults to 0
 * @returns An array of sanitized message objects, or an empty array if no messages are found
 * @throws {NotFoundError} If the conversation is not found or the user is not a participant
 */
export async function getMessages(c_user: string, conversationId: string, skip: number = 0) {
    await connectDB();

    // Make sure the conversation exists and user is a participant
    const conversation = await Conversation.findOne({
        _id: new Types.ObjectId(conversationId),
        participants: new Types.ObjectId(c_user),
    });

    if (!conversation) {
        throw new NotFoundError("Conversation not found or access denied");
    }

    // Fetch messages in that conversation
    const messages = await Message.find({
        conversation_id: conversation._id,
    })
        .sort({ created_at: -1 }) // newest first
        .limit(20)
        .skip(skip)
        .lean<IMessage[]>();

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
export async function deleteMessage(userId: string, messageId: string, conversationId: string) {
    await connectDB();

    const deletedMessage = await Message.findOneAndUpdate(
        { _id: messageId, sender: userId, deleted: { $ne: true }, conversation_id: conversationId },
        { $set: { deleted: true } },
        { new: true } // returns updated doc
    );

    if (!deletedMessage) {
        throw new NotFoundError('Message not found or already deleted');
    }

    return deletedMessage;
}

/**
 * Retrieves all conversations of a user.
 * 
 * Connects to the database and finds all conversation documents that contain the given user ID in their `participants` field.
 * The `participants` field is populated with the names and avatars of the other users in the conversation.
 * 
 * @param userId - The unique identifier of the user whose conversations to retrieve.
 * @returns An array of conversation objects, each with its `participants` field populated.
 */
export async function getConversations(userId: string) {
    await connectDB();

    const conversations = await Conversation.find({
        participants: new Types.ObjectId(userId),
    }).populate("participants", "name avatar").lean();

    return conversations || [];
}

/**
 * Retrieves a conversation by its ID.
 * 
 * Connects to the database and finds a conversation document with the given ID,
 * if the current user is a participant in the conversation.
 * The `participants` field is populated with the names and avatars of the other users in the conversation.
 * 
 * @param id - The unique identifier of the conversation to retrieve.
 * @param c_user - The unique identifier of the current user.
 * @returns A conversation object with its `participants` field populated, or null if the conversation is not found or the user is not a participant.
 */
export async function getAConversation(
    id: string,
    c_user: string
): Promise<IConversationPopulated | null> {
    await connectDB();

    const conversation = await Conversation.findOne({
        _id: new Types.ObjectId(id),                 // cast conversation ID
        participants: new Types.ObjectId(c_user)     // ensure user is a participant
    }).populate("participants", "name image username _id").lean<IConversationPopulated>();

    return conversation || null;
}

export async function markMessageAsSeen(messageId: string, conversationId: string, userId: string) {
    await connectDB();

    const message = await Message.findOneAndUpdate(
        { _id: new Types.ObjectId(messageId), conversation_id: new Types.ObjectId(conversationId) },
        { $addToSet: { read_by: new Types.ObjectId(userId) } },
        { new: true }
    ).lean<IMessage>();

    return message;
}