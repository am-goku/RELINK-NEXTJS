import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import React from "react";
import SignupClient from "./SignupClient";
import { redirect } from "next/navigation";

export default async function SignupPage() {

    const session = await getServerSession(authOptions)

    if(session) {
        redirect("/");
    }

    return <SignupClient />
}