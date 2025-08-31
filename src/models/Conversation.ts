import mongoose, { Schema, Types } from "mongoose";

export interface IConversation {
    _id: Types.ObjectId;
    is_group: boolean;
    participants: Types.ObjectId[];
    group_name?: string;
    group_image?: string;
    last_message: {
        text: string,
        sender_id: Types.ObjectId,
        created_at: Date
    };
    created_at?: Date;
    updated_at?: Date;
}

export interface IConversationPopulated extends Omit<IConversation, 'participants'> {
    participants: {
        _id: Types.ObjectId;
        username: string;
        name?: string;
        image?: string;
    }[];
}

export type IConversationDocument = IConversation & Document;

const ConversationSchema = new Schema<IConversationDocument>(
    {
        is_group: {
            type: Boolean,
            required: true
        },
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",   // <-- this is required for populate to work
                required: true
            }
        ],
        group_name: {
            type: String,
            required: false
        },
        group_image: {
            type: String,
            required: false
        },
        last_message: {
            text: {
                type: String,
                required: true
            },
            sender_id: {
                type: Schema.Types.ObjectId,
                required: true
            },
            created_at: {
                type: Date,
                required: true
            }
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
    }
);

const Conversation = mongoose.models.Conversation || mongoose.model<IConversationDocument>("Conversation", ConversationSchema);

export default Conversation;