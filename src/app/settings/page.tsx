import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import SettingsClient from "../../components/client/pages/settings/Settings.client";
import { redirect } from "next/navigation";

export default async function SettingsPage() {

  const session = await getServerSession(authOptions);

  if (!session) redirect("/connect");

  return <SettingsClient session={session} />
}
