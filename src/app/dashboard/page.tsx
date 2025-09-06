import DashboardPage from '@/components/client/dashboard/dashboard.client'
import { authOptions } from '@/lib/auth/authOptions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
import React from 'react'

async function Page() {

    const session = await getServerSession(authOptions);

    if (!session) redirect('/connect');

    return <DashboardPage />
}

export default Page