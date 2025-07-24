import { NextRequest, NextResponse } from 'next/server';
import Post from '@/models/Post';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { connectDB } from '@/lib/mongoose';
import { userAuth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
import { handleApiError } from '@/lib/errors/errorResponse';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const content = (formData.get('content') as string || '').trim();
        const hashtagsRaw = (formData.get('hashtags') as string || '').trim();
        const image = formData.get('image') as File | null;

        const user = await userAuth();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let image_url: string | undefined;

        if (image) {
            const buffer = Buffer.from(await image.arrayBuffer());

            const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'posts' },
                    (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                        if (error || !result) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(buffer);
            });
            image_url = uploadResult.secure_url;
        }

        if (!content && !image_url) {
            return NextResponse.json(
                { error: 'Either content or image is required.' },
                { status: 400 }
            );
        }

        const hashtags = hashtagsRaw
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);

        const newPost = new Post({
            content,
            image: image_url,
            user: user.id,
            hashtags,
            likes: [],
            comments: [],
            share_count: 0,
            views: 0,
        });

        await newPost.save();

        return NextResponse.json({ message: "Post created successfully", post: newPost }, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}


export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const user = await userAuth();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch all non-archived, non-blocked posts not created by the current user
        const posts = await Post.find({
            // user: { $ne: authUser.id },
            is_archived: false,
            is_blocked: false,
        })
            .sort({ created_at: -1 }) // Newest first
            .populate('user', 'name username image'); // Only fetch selected fields from User

        // Transform the posts to a safe public format
        const formattedPosts = posts.map(post => ({
            _id: post._id.toString(),
            content: post.content,
            image: post.image,
            likes_count: post.likes.length,
            comments_count: post.comments.length,
            share_count: post.share_count,
            views: post.views,
            hashtags: post.hashtags.join(', '),
            created_at: post.created_at,
            user: {
                _id: post.user._id.toString(),
                name: post.user.name,
                username: post.user.username,
                image: post.user.image,
            },
        }));

        return NextResponse.json({ message: 'Posts fetched successfully', posts: formattedPosts }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}