import { getServerSession } from "next-auth"
import ChatRoomClient from "../../../components/client/pages/chat/ChatRoom.client"
import { authOptions } from "@/lib/auth/authOptions"
import { redirect } from "next/navigation";
import { IConversationPopulated } from "@/models/Conversation";
import { fetchReceiver, fetchSelectedConversation } from "@/services/api/chat-apis";
import UserNotFound from "@/components/error/userNotFound";
import { cookies } from "next/headers";

type Props = {
    params: Promise<{ roomId: string }>;
    searchParams: Promise<{ new?: string }>; // mark as Promise
};

async function Page({ params, searchParams }: Props) {
    const session = await getServerSession(authOptions);
    if (!session) return redirect("/auth/login");

    const cookie = await cookies();

    const { roomId } = await params;
    const { new: isNewChatParam } = await searchParams; // ✅ await it
    const isNewChat = isNewChatParam?.toLowerCase() === "true";

    let room: IConversationPopulated | null = null;
    let receiver: IConversationPopulated['participants'][number] | null = null;

    try {
        if (isNewChat) {
            // Case 1: chat/[roomId]?new=true
            // here roomId is actually the receiver's userId
            receiver = await fetchReceiver(roomId, cookie.toString());

            if (!receiver) {
                console.warn("Receiver not found for new chat:", roomId);
                return <UserNotFound />;
            }
        } else {
            // Case 2: chat/[roomId]
            room = await fetchSelectedConversation(roomId, cookie.toString());

            if (!room) {
                console.warn("Room not found:", roomId);
                return <UserNotFound />;
            }

            // Validate that the current user is a participant
            const isParticipant = room.participants?.some(
                (p) => p._id.toString() === session.user.id
            );

            if (!isParticipant) {
                console.warn("User not authorized for this room:", session.user.id);
                return <UserNotFound />;
            }

            // Set receiver (the other person in the chat)
            receiver =
                room.participants?.find(
                    (p) => p._id.toString() !== session.user.id
                ) ?? null;

            if (!receiver) {
                console.warn("No valid receiver found in room:", roomId);
                return <UserNotFound />;
            }
        }
    } catch (error) {
        console.error("Chat page error:", error);
        return <UserNotFound />;
    }
    return (
        <ChatRoomClient
            session={session}
            receiver={receiver}
            room={room}
        />
    );
}

export default Page;
