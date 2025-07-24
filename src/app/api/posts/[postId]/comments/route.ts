import Comment, { IComment } from "@/models/Comment";
import { userAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {
        await connectDB();

        const { postId } = await params;

        const comments = await Comment.find({
            post: postId
        });

        if (!comments) {
            return NextResponse.json({ error: 'Comments not found' }, { status: 404 });
        }

        return NextResponse.json({ message: "Comments fetched successfully", comments }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {

        const authUser = await userAuth();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { postId } = await params;
        const { text }: IComment = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const newComment = new Comment({
            post: postId,
            comment: text,
            user: authUser.id
        })

        const comment = await newComment.save();

        return NextResponse.json({ message: "Comments created successfully", comment }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
