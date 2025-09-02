import apiInstance from "@/lib/axios";
import { IConversationPopulated } from "@/models/Conversation";
import { IMessage } from "@/models/Message";

export async function fetchReceiver(receiver_id: string, cookie?: string) {
    try {
        const res = await apiInstance.get(`/api/chat/${receiver_id}`, { headers: { cookie } });
        return res?.data?.receiver;
    } catch (error) {
        console.error("Error fetching receiver:", error);
        throw error;
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
        console.error("Error fetching conversations:", error);
        throw error;
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
        console.error("Error fetching conversation:", error);
        throw error;
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
        console.error("Error fetching conversation:", error);
        throw error;
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
        console.error("Error fetching messages:", error);
        throw error;
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
        if(!content.trim()) {
            throw new Error("Message content cannot be empty");
        }
        const res = await apiInstance.post(`/api/chat/conversation/${conversationId}/message`, { content });
        return res.data.messageData;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
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
        if(!content.trim()) {
            throw new Error("Message content cannot be empty");
        }
        const res = await apiInstance.post(`/api/chat/${receiver_id}`, { content });
        return { message: res.data.messageData, conversation: res.data.conversation };
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}