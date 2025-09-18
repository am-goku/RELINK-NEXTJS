import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/authOptions';
import ExplorePage from '@/components/client/explore/explore.client';

export default async function Page() {

    const session = await getServerSession(authOptions);

    if(!session) redirect("/connect");

    return <ExplorePage />
}
