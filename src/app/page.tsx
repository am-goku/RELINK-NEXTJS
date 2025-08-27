// src/app/dashboard/page.tsx (SERVER COMPONENT by default)
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardClient from "../components/client/pages/Home.client";
import { authOptions } from "@/lib/auth/authOptions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return <DashboardClient session={session} />;
}
