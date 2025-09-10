import ChatRoomsPage from '@/components/client/chat/chat.client'
import { authOptions } from '@/lib/auth/authOptions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
import React from 'react'


async function Page() {

    const session = await getServerSession(authOptions);

    if (!session) redirect('/connect');

    return <ChatRoomsPage session={session} />
}

export default Page