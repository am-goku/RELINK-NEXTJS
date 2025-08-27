import EditProfileClient from "@/components/client/pages/settings/EditProfile.client";
import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function EditProfilePage() {
  
  const session = await getServerSession(authOptions);

  if(!session) redirect('/auth/login');

  return <EditProfileClient session={session} />;
}