import apiInstance from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors/errorResponse";
import { IConversationPopulated } from "@/models/Conversation";
import { IMessage } from "@/models/Message";

/**
 * Fetches a user by their ID.
 * @param {string} receiver_id The ID of the user to fetch.
 * @param {string} [cookie] The cookie to send with the request.
 * @returns {Promise<SanitizedUser | null>} The fetched user, or null if not found.
 * @throws {Error} If there is an error fetching the user.
 */
export async function fetchReceiver(receiver_id: string, cookie?: string) {
    try {
        const res = await apiInstance.get(`/api/chat/${receiver_id}`, { headers: { cookie } });
        return res?.data?.receiver;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

/**
 * Fetches all the conversations of the current user.
 * @returns {Promise<Conversation[]>} The list of conversations.
 * @throws {Error} If there is an error fetching the conversations.
 */
export async function fetchConversations(): Promise<IConversationPopulated[]> {
    try {
        const res = await apiInstance.get('/api/chat/conversation');
        return res.data.conversations;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

/**
 * Fetches the conversations of the current user.
 * @returns {Promise<Conversation[]>} The list of conversations.
 * @throws {Error} If there is an error fetching the conversations.
 */
export async function fetchConversation(): Promise<IConversationPopulated[]> {
    try {
        const res = await apiInstance.get('/api/chat/conversation');
        return res.data.conversation || [];
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

/**
 * Fetches the selected conversation of the current user.
 * @param {string} id The ID of the conversation to fetch.
 * @returns {Promise<IConversationPopulated | null>} The selected conversation, or null if not found.
 * @throws {Error} If there is an error fetching the conversation.
 */
export async function fetchSelectedConversation(id: string, cookie?: string): Promise<IConversationPopulated | null> {
    try {
        const res = await apiInstance.get(`/api/chat/conversation/${id}`, { headers: { cookie } });
        return res.data.conversation || null;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

/**
 * Fetches all the messages in a conversation.
 * @param {string} conversationId The ID of the conversation to fetch the messages from.
 * @returns {Promise<Message[]>} The list of messages in the conversation.
 * @throws {Error} If there is an error fetching the messages.
 */
export async function fetchMessages(conversationId: string): Promise<IMessage[]> {
    try {
        const res = await apiInstance.get(`/api/chat/conversation/${conversationId}/message`);
        return res.data.messages || [];
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

/**
 * Sends a message in a conversation.
 * @param {string} conversationId The ID of the conversation to send the message in.
 * @param {string} content The content of the message to send.
 * @returns {Promise<Message>} The newly created message.
 * @throws {Error} If there is an error sending the message.
 */
export async function sendMessage(conversationId: string, content: string): Promise<IMessage> {
    try {
        if (!content.trim()) {
            throw new Error("Message content cannot be empty");
        }
        const res = await apiInstance.post(`/api/chat/conversation/${conversationId}/message`, { content });
        return res.data.messageData;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

/**
 * Starts a conversation with a given user and sends a message in the conversation.
 * @param {string} receiver_id The ID of the user to start the conversation with.
 * @param {string} content The content of the message to send.
 * @returns {Promise<{message:IMessage; conversation: IConversationPopulated}>} The newly created message and conversation.
 * @throws {Error} If there is an error starting the conversation or sending the message.
 */
export async function startMessage(receiver_id: string, content: string): Promise<{ message: IMessage; conversation: IConversationPopulated }> {
    try {
        if (!content.trim()) {
            throw new Error("Message content cannot be empty");
        }
        const res = await apiInstance.post(`/api/chat/${receiver_id}`, { content });
        return { message: res.data.messageData, conversation: res.data.conversation };
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

/**
 * Marks a message as seen in a conversation.
 * @param {string} conversation_id The ID of the conversation that contains the message to mark as seen.
 * @param {string} message_id The ID of the message to mark as seen.
 * @returns {Promise<IMessage>} The updated message document.
 * @throws {Error} If there is an error marking the message as seen.
 */
export async function markSeen(conversation_id: string, message_id: string): Promise<IMessage> {
    try {
        const res = await apiInstance.patch(`/api/chat/conversation/${conversation_id}/message/${message_id}/seen`);
        return res.data.messageData;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}