import mongoose, { Schema, Types } from "mongoose";

export interface IMessage {
    _id: Types.ObjectId;
    message: string;
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    deleted: boolean
}

export type IMessageDocument = IMessage & Document;

const MessageSchema = new Schema<IMessageDocument>(
    {
        message: {
            type: String,
            required: true
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
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