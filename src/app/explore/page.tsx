import React from 'react';
import ExploreClient from '../../components/client/pages/Explore.client';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/authOptions';

export default async function ExplorePage() {

    const session = await getServerSession(authOptions);

    if(!session) {
        redirect("/auth/login");
    }

    return <ExploreClient session={session} />
}
