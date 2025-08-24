import { userAuth } from "@/lib/auth";
import { updateProfilePic } from "@/lib/controllers/userController";
import { BadRequestError, InternalServerError } from "@/lib/errors/ApiErrors";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const user = await userAuth();

        const form = await req.formData();
        const file = form.get('file');

        if (!file || typeof file !== 'object') throw new BadRequestError('Invalid file');

        const url = await updateProfilePic(file as File, user.id);

        if (!url) throw new InternalServerError('Failed to update profile pic');

        return NextResponse.json({ url })

    } catch (error) {
        return handleApiError(error);
    }
}