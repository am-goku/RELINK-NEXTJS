import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PrimaryButton from '../template/primary-button';
import { emailRegex, passwordRegex, usernameRegex } from '@/utils/validators';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import FieldLabel from '../ui/label/ConnectLablel';
import { TextInput } from '../ui/fields/connectFields';
import { register_user } from '@/services/api/auth-apis';
import { checkUsernameAvailability } from '@/services/api/user-apis';

type Props = {
    submitting: boolean;
    setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    setGlobalError: React.Dispatch<React.SetStateAction<string | null>>;
    setGlobalSuccess: React.Dispatch<React.SetStateAction<string | null>>;
    setMode: React.Dispatch<React.SetStateAction<"login" | "signup">>;
}

function SignupForm({ setGlobalError, setGlobalSuccess, setSubmitting, submitting, setMode }: Props) {

    // signup state
    const [suEmail, setSuEmail] = useState("");
    const [suUsername, setSuUsername] = useState("");
    const [suPassword, setSuPassword] = useState("");
    const [suConfirm, setSuConfirm] = useState("");
    const [showSuPassword, setShowSuPassword] = useState(false);
    const [showSuConfirm, setShowSuConfirm] = useState(false);
    const [signupErrors, setSignupErrors] = useState<{
        email?: string;
        username?: string;
        password?: string;
        confirm?: string;
    }>({});
    const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

    // derived password strength
    const passwordStrength = useMemo(() => {
        if (!suPassword) return 0;
        let score = 0;
        if (suPassword.length >= 8) score++;
        if (/[A-Z]/.test(suPassword)) score++;
        if (/[a-z]/.test(suPassword)) score++;
        if (/\d/.test(suPassword)) score++;
        if (/[^A-Za-z0-9]/.test(suPassword)) score++;
        return Math.min(score, 5);
    }, [suPassword]);

    // handlers
    function validateSignup(baseOnly = false) {
        const errs: { email?: string; username?: string; password?: string; confirm?: string } = {};
        if (!suEmail) errs.email = "Email is required.";
        else if (!emailRegex.test(suEmail)) errs.email = "Enter a valid email.";
        if (!suUsername) errs.username = "Username is required.";
        else if (!usernameRegex.test(suUsername))
            errs.username = "3-20 chars, letters/numbers/_ only.";
        if (!suPassword) errs.password = "Password is required.";
        else if (!passwordRegex.test(suPassword))
            errs.password = "Min 8 chars with letters and numbers.";
        if (!suConfirm) errs.confirm = "Confirm your password.";
        else if (suPassword !== suConfirm) errs.confirm = "Passwords do not match.";
        setSignupErrors(errs);
        if (baseOnly) return Object.keys(errs).length === 0;
        return Object.keys(errs).length === 0;
    }

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setGlobalError(null);
        setGlobalSuccess(null);
        const ok = validateSignup();
        if (!ok) return;

        // Ensure username availability
        setUsernameStatus("checking");
        const unique = await checkUsernameAvailability(suUsername);
        setUsernameStatus(unique ? "available" : "taken");
        if (!unique) {
            setSignupErrors((s) => ({ ...s, username: "Username already taken." }));
            return;
        }

        try {
            setSubmitting(true);
            await register_user({
                email: suEmail.toLowerCase(),
                password: suPassword,
                username: suUsername,
            });
            setGlobalSuccess("Account created. You can log in now.");
            setMode("login");
            setSuEmail("");
            setSuUsername("");
            setSuPassword("");
            setSuConfirm("");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err) {
                if (err?.code === "USERNAME_TAKEN") {
                    setSignupErrors((s) => ({ ...s, username: "Username already taken." }));
                    setUsernameStatus("taken");
                } else if (err?.code === "EMAIL_TAKEN") {
                    setSignupErrors((s) => ({ ...s, email: "Email already registered." }));
                } else {
                    setGlobalError(err?.message || "Signup failed. Please try again.");
                }
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleUsernameBlur() {
        if (!suUsername || !usernameRegex.test(suUsername)) return;
        setUsernameStatus("checking");
        const unique = await checkUsernameAvailability(suUsername);
        setUsernameStatus(unique ? "available" : "taken");
        if (!unique) setSignupErrors((s) => ({ ...s, username: "Username already taken." }));
    }

    return (
        <React.Fragment>
            <motion.form
                key="signup"
                onSubmit={handleSignup}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
            >
                <div>
                    <FieldLabel htmlFor="su-email">Email</FieldLabel>
                    <TextInput
                        id="su-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={suEmail}
                        onChange={(e) => setSuEmail(e.target.value)}
                        onBlur={() => validateSignup(true)}
                        error={signupErrors.email}
                        leftIcon={<Mail className="h-4 w-4" />}
                    />
                </div>

                <div>
                    <FieldLabel htmlFor="su-username">Username</FieldLabel>
                    <TextInput
                        id="su-username"
                        type="text"
                        autoComplete="username"
                        placeholder="your_handle"
                        value={suUsername}
                        onChange={(e) => {
                            setSuUsername(e.target.value);
                            setSignupErrors((s) => ({ ...s, username: undefined }));
                            setUsernameStatus("idle");
                        }}
                        onBlur={handleUsernameBlur}
                        error={signupErrors.username}
                        leftIcon={<User className="h-4 w-4" />}
                        rightAdornment={
                            usernameStatus === "checking" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : usernameStatus === "available" ? (
                                <CheckCircle2 className="h-4 w-4" />
                            ) : usernameStatus === "taken" ? (
                                <AlertCircle className="h-4 w-4" />
                            ) : null
                        }
                    />
                    <p className="mt-1 text-xs opacity-70">3–20 characters. Letters, numbers, and underscore only.</p>
                </div>

                <div>
                    <FieldLabel htmlFor="su-password">Password</FieldLabel>
                    <TextInput
                        id="su-password"
                        type={showSuPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Create a strong password"
                        value={suPassword}
                        onChange={(e) => setSuPassword(e.target.value)}
                        onBlur={() => validateSignup(true)}
                        error={signupErrors.password}
                        leftIcon={<Lock className="h-4 w-4" />}
                        rightAdornment={
                            <button
                                type="button"
                                onClick={() => setShowSuPassword((s) => !s)}
                                aria-label={showSuPassword ? "Hide password" : "Show password"}
                                className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10"
                            >
                                {showSuPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        }
                    />

                    {/* Strength meter */}
                    <div className="mt-2 h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10">
                        <div
                            className={`h-full rounded-full transition-all ${passwordStrength >= 4
                                ? "bg-emerald-500"
                                : passwordStrength >= 3
                                    ? "bg-yellow-500"
                                    : passwordStrength >= 2
                                        ? "bg-orange-500"
                                        : passwordStrength >= 1
                                            ? "bg-red-500"
                                            : "bg-transparent"
                                }`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                    </div>
                </div>

                <div>
                    <FieldLabel htmlFor="su-confirm">Confirm Password</FieldLabel>
                    <TextInput
                        id="su-confirm"
                        type={showSuConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Re-enter password"
                        value={suConfirm}
                        onChange={(e) => setSuConfirm(e.target.value)}
                        onBlur={() => validateSignup(true)}
                        error={signupErrors.confirm}
                        leftIcon={<Lock className="h-4 w-4" />}
                        rightAdornment={
                            <button
                                type="button"
                                onClick={() => setShowSuConfirm((s) => !s)}
                                aria-label={showSuConfirm ? "Hide password" : "Show password"}
                                className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10"
                            >
                                {showSuConfirm ? (
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
                    Create account
                </PrimaryButton>

                <p className="text-center text-xs opacity-70">
                    By signing up you agree to our Terms & Privacy.
                </p>
            </motion.form>
        </React.Fragment>
    )
}

export default SignupForm