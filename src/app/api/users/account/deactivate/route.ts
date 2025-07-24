import { userAuth } from '@/lib/auth';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function PATCH() {
    try {
        const user = await userAuth();
        await User.findByIdAndUpdate(user?.id, { blocked: true });
        return NextResponse.json({ message: 'Account deactivated' });
    } catch {
        return NextResponse.json({ error: 'Failed to deactivate' }, { status: 500 });
    }
}