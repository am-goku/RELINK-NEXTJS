import { NextRequest, NextResponse } from 'next/server';
import { userAuth } from '@/lib/auth';
import User from '@/models/User';

export async function PATCH(req: NextRequest) {
    try {
        const user = await userAuth();
        const { newEmail } = await req.json();

        if (!newEmail) return NextResponse.json({ error: 'Email required' }, { status: 400 });

        await User.findByIdAndUpdate(user?.id, { email: newEmail });
        return NextResponse.json({ message: 'Email updated.' });
    } catch {
        return NextResponse.json({ error: 'Email update failed' }, { status: 500 });
    }
}