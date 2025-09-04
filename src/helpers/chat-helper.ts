import { IConversationPopulated } from "@/models/Conversation";

function hasParticipantInNonGroup(
    conversations: IConversationPopulated[],
    participantId: string
): boolean {
    return conversations.some((conv) =>
        !conv.is_group &&
        conv.participants.some((p) => p._id.toString() === participantId)
    );
}

export { hasParticipantInNonGroup };