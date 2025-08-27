import ProfileClient from "../../components/client/pages/Profile.client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/authOptions"
import { notFound, redirect } from "next/navigation";
import { getUserProfileData } from "@/services/api/user-apis";
import { cookies } from "next/headers";

async function Page({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const session = await getServerSession(authOptions);

    if (!session) redirect("/auth/login");

    const cookie = await cookies()

    const user = await getUserProfileData({ username, cookie: cookie.toString() });
    if (!user) notFound();

    const isOwner = session.user.id === user._id.toString();

    return <ProfileClient session={session} user={user} isOwner={isOwner} />
}

export default Page
