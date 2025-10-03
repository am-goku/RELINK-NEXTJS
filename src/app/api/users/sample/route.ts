import { userAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { handleApiError } from "@/lib/errors/errorResponse";
import User from "@/models/User";
import { sanitizeUser } from "@/utils/sanitizer/user";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const size = searchParams.get("size") || 3;

        const user = await userAuth();

        await connectDB();

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: new Types.ObjectId(user.id) },
                    role: 'user',
                    blocked: { $ne: true },
                    deleted: { $ne: true },
                    followers: { $ne: new Types.ObjectId(user.id) },
                    following: { $ne: new Types.ObjectId(user.id) }
                }
            },
            { $sample: { size: Number(size) } } // Randomly select 3 users
        ]);

        const data = users.map(u => sanitizeUser(u));

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
} // GET User Samples [api: GET /users/sample?size=]