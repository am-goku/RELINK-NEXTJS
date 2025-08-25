import { userAuth } from "@/lib/auth";
import { switchMessagePermission } from "@/lib/controllers/accountController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { IUser } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: { params: Promise<{ from: string }> }) {
    try {
        const user = await userAuth();

        const { from } = await context.params as { from: string };

        if (from !== "everyone" && from !== "followers" && from !== "none") {
            throw new Error("Invalid 'from' parameter");
        }
        const typedFrom: IUser["messageFrom"] = from;

        const res = await switchMessagePermission(user.id, typedFrom);

        return NextResponse.json(res);

    } catch (error) {
        return handleApiError(error)
    }
}