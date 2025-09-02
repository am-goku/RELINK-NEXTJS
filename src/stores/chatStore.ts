import { IConversationPopulated } from "@/models/Conversation";
import { create } from "zustand";

type ChatStore = {
    selectedRoom: IConversationPopulated | null;
    setSelectedRoom: (room: IConversationPopulated) => void;
    clearSelectedRoom: () => void;

    chatRooms: IConversationPopulated[];
    setChatRooms: (chatRooms: IConversationPopulated[]) => void;
    addChatRoom: (room: IConversationPopulated) => void;

    updateChatRoomLastMessage: (roomId: string, lastMessage: IConversationPopulated['last_message']) => void;
    reorderChatRoom: (roomId: string) => void;

    removeChatRoom: (roomId: string) => void;
    updateChatRoom: (room: IConversationPopulated) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
    // Selected room (initially null)
    selectedRoom: null,
    setSelectedRoom: (room) => set(() => ({ selectedRoom: room })),
    clearSelectedRoom: () => set(() => ({ selectedRoom: null })),

    // Chat rooms (initially empty array)
    chatRooms: [],
    setChatRooms: (chatRooms) => set(() => ({ chatRooms })),

    // Update last_message in the selected room
    updateChatRoomLastMessage: (roomId: string, lastMessage: IConversationPopulated['last_message']) =>
    set((state) => ({
        chatRooms: state.chatRooms.map((r) =>
            r._id.toString() === roomId ? { ...r, last_message: lastMessage } : r
        ),
    })),

    // Add a new chat room
    addChatRoom: (room) =>
        set((state) => ({ chatRooms: [...state.chatRooms, room] })),

    // Move a room to the top when new messages arrive
    reorderChatRoom: (roomId: string) =>
        set((state) => {
            const room = state.chatRooms.find((r) => r._id.toString() === roomId);
            if (!room) return state;
            const remaining = state.chatRooms.filter((r) => r._id.toString() !== roomId);
            return { chatRooms: [room, ...remaining] };
        }),

    // Remove a chat room by ID
    removeChatRoom: (roomId) =>
        set((state) => ({
            chatRooms: state.chatRooms.filter((r) => r._id.toString() !== roomId),
        })),

    // Update a chat room by replacing with new data
    updateChatRoom: (room) =>
        set((state) => ({
            chatRooms: state.chatRooms.map((r) =>
                r._id.toString() === room._id.toString() ? room : r
            ),
        })),
}));
