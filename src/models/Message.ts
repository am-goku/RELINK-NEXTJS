import mongoose, { Schema, Types } from "mongoose";

export interface IMessage {
    _id: Types.ObjectId;
    conversation_id: Types.ObjectId;
    sender: Types.ObjectId;
    text: string;
    message_type: 'text' | 'image' | 'video' | 'file';
    ready_by: Types.ObjectId[];
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
}

export type IMessageDocument = IMessage & Document;

const MessageSchema = new Schema<IMessageDocument>(
    {
        conversation_id: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },
        text: {
            type: String,
            required: true
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message_type: {
            type: String,
            enum: ['text', 'image', 'video', 'file'],
            default: 'text'
        },
        ready_by: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: []
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
    }
)

// Index for faster chat queries
MessageSchema.index({ sender: 1, receiver: 1, created_at: 1 });

const Message = mongoose.models.Message || mongoose.model<IMessageDocument>("Message", MessageSchema);

export default Message;