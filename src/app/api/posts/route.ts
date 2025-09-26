import { NextRequest, NextResponse } from 'next/server';
import { userAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/errors/errorResponse';
import { createPost, getPosts } from '@/lib/controllers/post';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const user = await userAuth();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const post = await createPost(formData, user.id);

        return NextResponse.json({ message: "Post created successfully", post }, { status: 201 });
    } catch (error) {
        console.log(error)
        return handleApiError(error);
    }
}


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const page = searchParams.get("page") || 1;

        const user = await userAuth();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await getPosts(Number(page));

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}