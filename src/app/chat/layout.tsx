import { getServerSession } from "next-auth";
import ChatLayoutClient from "../../components/client/pages/chat/ChatLayout.client"
import { authOptions } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";

type Props = { children: React.ReactNode }

export default async function Layout({ children }: Props) {

    const session = await getServerSession(authOptions);

    if (!session) redirect("/connect");

    return (
        <ChatLayoutClient session={session}>
            {children}
        </ChatLayoutClient>
    )
}