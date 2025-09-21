"use client";

import apiInstance from "@/lib/axios";
import socket from "@/lib/socket/socket";
import { IConversationPopulated } from "@/models/Conversation";
import { useChatStore } from "@/stores/chatStore";
import { useUnreadStore } from "@/stores/unreadStore";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

function ChatInitializer() {
    const { status } = useSession();
    
    const initializedRef = useRef(false);

    const setRooms = useChatStore((s) => s.setChatRooms);
    const activeRoom = useChatStore(state => state.selectedRoom);
    const updateLastMessage = useChatStore(state => state.updateChatRoomLastMessage);
    const reorderRooms = useChatStore(state => state.reorderChatRoom);
    
    const increment = useUnreadStore(state => state.increment);

    useEffect(() => {
        const fetchRooms = async () => {
            if (status === "authenticated" && !initializedRef.current) {
                initializedRef.current = true;

                const chatRooms = (await apiInstance.get('/api/chat/conversation')).data.conversations || [];
                setRooms(chatRooms);

                // batch join
                socket.emit(
                    "join-rooms",
                    chatRooms.map((r: IConversationPopulated) => r._id.toString())
                );
            }
        };

        fetchRooms();
    }, [status, setRooms]); // 

    useEffect(() => {
        socket.on("receive-message", ({ roomId, message }) => {
            if (roomId) {
                updateLastMessage(roomId, message);
                reorderRooms(roomId);
                if (activeRoom?._id.toString() !== roomId) {
                    increment(roomId);
                }
            }
        })
    }, [activeRoom, increment, reorderRooms, updateLastMessage])

    useEffect(() => {
        if (status === "unauthenticated") {
            socket.disconnect();
        }
    }, [status]);

    return null; // No render, only initializing
}

export default ChatInitializer;
