import { userAuth } from "@/lib/auth";
import { switchAccountType } from "@/lib/controllers/accountController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextResponse } from "next/server";

export async function PATCH() {
    try {
        const user = await userAuth();

        const res = await switchAccountType(user.id);

        return NextResponse.json(res);

    } catch (error) {
        return handleApiError(error);
    }
}