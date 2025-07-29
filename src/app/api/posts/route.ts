import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { userAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/errors/errorResponse';
import { createPost, getPosts } from '@/lib/controllers/postController';
import { SessionUser } from '@/types/instance';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const user: SessionUser = await userAuth();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const post = await createPost(formData, user)

        return NextResponse.json({ message: "Post created successfully", post }, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}


export async function GET() {
    try {
        const user = await userAuth();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const posts = await getPosts();

        return NextResponse.json({ message: 'Posts fetched successfully', posts }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}