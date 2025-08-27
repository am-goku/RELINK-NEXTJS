import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import LoginClient from '../../../components/client/pages/Login.client';

export default async function LoginPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/");
    }

    return <LoginClient />;
}
