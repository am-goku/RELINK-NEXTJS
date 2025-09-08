import { authOptions } from '@/lib/auth/authOptions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function page() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/connect");
    }

    redirect("/dashboard")
}