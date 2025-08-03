// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanitizeMessage(msg: any) {
    return {
        _id: msg._id,
        sender: msg.sender,
        text: msg.deleted ? "This message was deleted." : msg.text,
        deleted: msg.deleted ?? false,
        created_at: msg.created_at,
        updated_at: msg.updated_at
    };
}
