import { NextRequest, NextResponse } from 'next/server';
import { userAuth } from '@/lib/auth';
import User from '@/models/User';

export async function PATCH(req: NextRequest) {
    try {
        const user = await userAuth();
        const { currentPassword, newPassword } = await req.json();

        const dbUser = await User.findById(user?.id);
        if (!dbUser || !(await dbUser.comparePassword(currentPassword))) {
            return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
        }

        dbUser.password = newPassword;
        await dbUser.save();

        return NextResponse.json({ message: 'Password updated' });
    } catch {
        return NextResponse.json({ error: 'Password update failed' }, { status: 500 });
    }
}