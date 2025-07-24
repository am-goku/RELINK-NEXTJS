import { userAuth } from '@/lib/auth';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function DELETE() {
    try {
        const user = await userAuth();
        await User.findByIdAndUpdate(user?.id, { deleted: true });
        return NextResponse.json({ message: 'Account deleted' });
    } catch {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}