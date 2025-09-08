import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { redirect } from 'next/navigation';
import AuthPage from '@/components/client/connect/auth.client';


export default async function Page() {
    const session = await getServerSession(authOptions);

    if (session) return redirect("/dashboard");

    return <AuthPage />
}