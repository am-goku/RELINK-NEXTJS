import DashboardPage from '@/components/client/dashboard/dashboard.client'
import { authOptions } from '@/lib/auth/authOptions'
import apiInstance from '@/lib/axios';
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'

async function Page() {

    const session = await getServerSession(authOptions);

    if (!session) redirect('/connect');

    const cookie = (await cookies()).toString();

    const { posts, totalPages, hasMore } = (await apiInstance.get(`/api/posts?page=1`, { headers: { "cookie": cookie ?? "" } })).data;

    return <DashboardPage initialPosts={posts} totalPages={totalPages} initialHasMore={hasMore} />
}

export default Page