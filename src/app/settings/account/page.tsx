import { getServerSession } from "next-auth";
import AccountClient from "../../../components/client/pages/settings/Account.client";
import { authOptions } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";


export default async function AccountPage() {

  const session = await getServerSession(authOptions);

  if(!session) redirect('/auth/login');

  return <AccountClient session={session} />
}
