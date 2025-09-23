import PostClient from '@/components/client/post/post.client';
import { authOptions } from '@/lib/auth/authOptions';
import apiInstance from '@/lib/axios';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import React from 'react'

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

async function Page({ params }: PostPageProps) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) redirect('/connect');

    const cookie = (await cookies()).toString();

    const { id } = await params;

    if (!id) notFound();

    const data = (await apiInstance.get(`/api/posts/${id}`, { headers: { "cookie": cookie ?? "" } })).data;

    if (!data || !data.post) throw new Error();

    const isOwner = session.user.id === data.post.author._id.toString();

    return <PostClient
      session={session}
      isOwner={isOwner}
      post={data.post}
    />
  } catch (error) {
    console.log(error)
    return notFound();
  }
}

export default Page;