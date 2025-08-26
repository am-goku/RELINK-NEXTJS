import React from 'react';
import ExploreClient from './ExploreClient';
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
