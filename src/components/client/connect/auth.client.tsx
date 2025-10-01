"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
} from "lucide-react";
import LoginForm from "@/components/forms/login";
import SignupForm from "@/components/forms/signup";
import Footer from "@/components/nav/footer";
import SignupOtpForm from "@/components/forms/signup-otp";
import DemoCredentialsFloat from "@/components/demo/DemoCredentialFloat";


export default function AuthPage() {
    // mode
    const [mode, setMode] = useState<"login" | "signup" | "otp">("login");

    // shared ui
    const [submitting, setSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

    // Signup States
    const [otpEmail, setOtpEmail] = useState("");
    const [otpUsername, setOtpUsername] = useState("");

    // Otp Form States
    const [fromSignup, setFromSignup] = useState(true);

    useEffect(() => {
        setGlobalError(null);
        setGlobalSuccess(null);
    }, [mode]);

    return (
        <React.Fragment>
            <div className="min-h-screen w-full bg-[#F0F2F5] dark:bg-neutral-900 text-[#2D3436] dark:text-gray-200">
                {/* Header / Brand */}
                <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-light-bg/90 dark:bg-dark-bg/90 shadow-sm">
                            {/* Dummy Logo */}
                            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-lg font-bold leading-tight">ReLink</p>
                            <p className="text-xs opacity-70">Connect • Share • Grow</p>
                        </div>
                    </div>
                    <div className="hidden md:block text-sm opacity-80">Welcome to your social hub</div>
                </header>

                {/* Main Layout */}
                <main className="mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-6xl grid-cols-1 gap-8 px-4 pb-10 md:grid-cols-2">
                    {/* Left: Marketing / Illustration */}
                    <section className="relative hidden md:flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="rounded-3xl bg-light-bg/90 dark:bg-dark-bg/90 p-8 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
                        >
                            <h1 className="mb-3 text-3xl font-extrabold tracking-tight">Welcome to ReLink</h1>
                            <p className="mb-6 text-sm leading-6 opacity-80">
                                A clean and modern social platform to connect with friends, share
                                ideas, and build communities. Join today and start your journey.
                            </p>
                            <ul className="space-y-3 text-sm">
                                {[
                                    "Simple, secure login",
                                    "Unique usernames to stand out",
                                    "Privacy-first by design",
                                ].map((t) => (
                                    <li key={t} className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5" /> {t}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </section>

                    {/* Right: Auth Card */}
                    <section className="flex items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45 }}
                            className="w-full rounded-3xl bg-white/70 p-6 shadow-xl backdrop-blur-md ring-1 ring-black/5 dark:bg-neutral-800/70 dark:ring-white/10"
                        >
                            {/* Mode Switch */}
                            <div className="mb-6 grid grid-cols-2 rounded-2xl bg-[#F0F2F5] p-1 dark:bg-neutral-900">
                                {["login", "signup"].map((m) => (
                                    <button
                                        key={m}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        onClick={() => setMode(m as any)}
                                        className={`rounded-2xl py-2 text-sm font-semibold transition-all ${mode === m
                                            ? "bg-white shadow dark:bg-neutral-700"
                                            : "opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        {m === "login" ? "Log in" : "Sign up"}
                                    </button>
                                ))}
                            </div>

                            {/* Alerts */}
                            <AnimatePresence initial={false}>
                                {globalError && (
                                    <motion.div
                                        key="error"
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="mb-4 flex items-start gap-3 rounded-2xl border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-700/60 dark:bg-red-950/40 dark:text-red-300"
                                    >
                                        <AlertCircle className="mt-0.5 h-5 w-5" />
                                        <p className="text-sm">{globalError}</p>
                                    </motion.div>
                                )}
                                {globalSuccess && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-3 text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                                    >
                                        <CheckCircle2 className="mt-0.5 h-5 w-5" />
                                        <p className="text-sm">{globalSuccess}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Forms */}
                            <div className="relative">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {mode === "login" ? (
                                        <LoginForm
                                            submitting={submitting}
                                            setGlobalError={setGlobalError}
                                            setGlobalSuccess={setGlobalSuccess}
                                            setSubmitting={setSubmitting}
                                            setMod={setMode}
                                            setOtpEmail={setOtpEmail}
                                            setFromSignup={setFromSignup}
                                            setOtpUsername={setOtpUsername} />
                                    ) : mode === "signup" ? (
                                        <SignupForm
                                            setMode={setMode}
                                            setGlobalError={setGlobalError}
                                            submitting={submitting}
                                            setSubmitting={setSubmitting}
                                            setGlobalSuccess={setGlobalSuccess}
                                            setOtpEmail={setOtpEmail}
                                            setOtpUsername={setOtpUsername} />
                                    ) : mode === "otp" ? (
                                        <SignupOtpForm
                                            fromSignup={fromSignup}
                                            setFromSignup={setFromSignup}
                                            otpEmail={otpEmail}
                                            otpUsername={otpUsername}
                                            setGlobalError={setGlobalError} />
                                    ) : null}
                                </AnimatePresence>
                            </div>

                            {/* Footer Switch */}
                            <div className="mt-6 text-center text-sm">
                                {mode === "login" ? (
                                    <button
                                        type="button"
                                        onClick={() => setMode("signup")}
                                        className="font-semibold underline-offset-2 hover:underline"
                                    >
                                        New here? Create an account
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setMode("login")}
                                        className="font-semibold underline-offset-2 hover:underline"
                                    >
                                        Already have an account? Log in
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </section>
                </main>

                {/* Footer */}
                <Footer />
            </div>

            <DemoCredentialsFloat />
        </React.Fragment>
    );
}
