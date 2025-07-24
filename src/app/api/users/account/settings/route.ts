import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { userAuth } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
    try {
        const user = await userAuth();
        const { accountType, messageFrom, onlineStatus } = await req.json();

        await User.findByIdAndUpdate(user?.id, {
            ...(accountType && { accountType }),
            ...(messageFrom && { messageFrom }),
            ...(typeof onlineStatus === 'boolean' && { onlineStatus }),
        });

        return NextResponse.json({ message: 'Settings updated.' }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update settings.', err }, { status: 500 });
    }
}