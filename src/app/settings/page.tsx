import SettingsClient from "@/components/client/settings/settings.client";
import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {

  const session = await getServerSession(authOptions);

  if (!session) redirect("/connect");

  return <SettingsClient session={session} />
}
