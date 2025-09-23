import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { emailRegex } from '@/utils/validators';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import PrimaryButton from '../template/primary-button';
import FieldLabel from '../ui/label/ConnectLablel';
import { TextInput } from '../ui/fields/connectFields';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Props = {
    submitting: boolean;
    setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    setGlobalError: React.Dispatch<React.SetStateAction<string | null>>;
    setGlobalSuccess: React.Dispatch<React.SetStateAction<string | null>>;
    setOtpEmail: React.Dispatch<React.SetStateAction<string>>;
    setOtpUsername: React.Dispatch<React.SetStateAction<string>>;
    setMod: React.Dispatch<React.SetStateAction<"login" | "signup" | "otp">>;
    setFromSignup: React.Dispatch<React.SetStateAction<boolean>>
}

function LoginForm({ submitting, setGlobalError, setGlobalSuccess, setSubmitting, setOtpEmail, setOtpUsername, setMod, setFromSignup }: Props) {

    const router = useRouter();

    // login state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});

    // handlers
    function validateLogin() {
        const errs: { email?: string; password?: string } = {};
        if (!loginEmail) errs.email = "Email is required.";
        else if (!emailRegex.test(loginEmail)) errs.email = "Enter a valid email.";
        if (!loginPassword) errs.password = "Password is required.";
        else if (loginPassword.length < 8) errs.password = "Password must be at least 8 characters.";
        setLoginErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setGlobalError(null);
        setGlobalSuccess(null);
        if (!validateLogin()) return;
        try {
            setSubmitting(true);
            const res = await signIn("credentials", {
                redirect: false,
                email: loginEmail.toLowerCase(),
                password: loginPassword
            })
            if(!res?.ok) throw new Error(res?.error || undefined)
            setGlobalSuccess("Logged in successfully.");
            router.push("/dashboard");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err instanceof Error) {
                let parsed;
                try {
                    parsed = JSON.parse(err.message);
                } catch {
                    parsed = { message: err.message };
                }

                if (parsed.cause?.verified === false) {
                    setOtpEmail(parsed.cause.email);
                    setOtpUsername(parsed.cause.username);
                    setFromSignup(false);
                    setMod("otp");
                }

                setGlobalError(parsed.message);
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <React.Fragment>
            <motion.form
                key="login"
                onSubmit={handleLogin}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
            >
                <div>
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <TextInput
                        id="login-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        onBlur={validateLogin}
                        error={loginErrors.email}
                        leftIcon={<Mail className="h-4 w-4" />}
                    />
                </div>

                <div>
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <TextInput
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        onBlur={validateLogin}
                        error={loginErrors.password}
                        leftIcon={<Lock className="h-4 w-4" />}
                        rightAdornment={
                            <button
                                type="button"
                                onClick={() => setShowLoginPassword((s) => !s)}
                                aria-label={showLoginPassword ? "Hide password" : "Show password"}
                                className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10"
                            >
                                {showLoginPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        }
                    />
                </div>

                <PrimaryButton
                    type="submit"
                    loading={submitting}
                    disabled={submitting}
                    aria-busy={submitting}
                >
                    Log in
                </PrimaryButton>

                <p className="text-center text-xs opacity-70">
                    By continuing you agree to our Terms & Privacy.
                </p>
            </motion.form>
        </React.Fragment>
    )
}

export default LoginForm