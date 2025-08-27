import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import React from "react";
import SignupClient from "../../../components/client/pages/Signup.client";
import { redirect } from "next/navigation";

export default async function SignupPage() {

    const session = await getServerSession(authOptions)

    if(session) {
        redirect("/");
    }

    return <SignupClient />
}