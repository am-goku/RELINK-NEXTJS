import { NextResponse } from "next/server";
import { userAuth } from "@/lib/auth"; // adapt
import { getUnreadCountsForUser } from "@/lib/controllers/message";

export async function GET() {
    const user = await userAuth(); // must return { id: string } or null
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const map = await getUnreadCountsForUser(user.id);
    // return as array for easier client handling
    const list = Object.entries(map).map(([conversation_id, unreadCount]) => ({ conversation_id, unreadCount }));
    return NextResponse.json(list);
}