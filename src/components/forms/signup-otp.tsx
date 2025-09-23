import React, { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import FieldLabel from '../ui/label/ConnectLablel';
import { TextInput } from '../ui/fields/connectFields';
import { Lock, Mail, User } from 'lucide-react';
import PrimaryButton from '../template/primary-button';
import { getErrorMessage } from '@/lib/errors/errorResponse';
import apiInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';

type Props = {
    otpEmail: string;
    otpUsername: string;
    fromSignup: boolean;
    setFromSignup: React.Dispatch<React.SetStateAction<boolean>>;
    setGlobalError: React.Dispatch<React.SetStateAction<string | null>>;
}

function SignupOtpForm({ otpEmail, otpUsername, fromSignup, setFromSignup, setGlobalError }: Props) {
    const router = useRouter();

    // form states
    const [otpCode, setOtpCode] = React.useState<string>("");

    // ui states
    const [otpSubmitting, setOtpSubmitting] = React.useState<boolean>(false);
    const [reSendIn, setReSendIn] = React.useState<number>(fromSignup ? 30 : 0);

    const verifyOtpAndSignup = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalError(null);

        if (!otpCode) return;

        setOtpSubmitting(true);
        try {
            await apiInstance.post("/api/auth/signup", {
                email: otpEmail,
                username: otpUsername,
                otp: otpCode
            })

            router.push("/dashboard");
        } catch (error) {
            const err = getErrorMessage(error);
            setGlobalError(err);
        } finally {
            setOtpSubmitting(false);
        }
    }, [otpCode, otpEmail, otpUsername, router, setGlobalError]) // verify otp and signup

    const resendOtp = async () => {
        setOtpSubmitting(true);
        try {
            await apiInstance.put("/api/auth/register", {
                email: otpEmail,
                username: otpUsername
            })
            setFromSignup(true);
            setReSendIn(30);
        } catch (error) {
            const err = getErrorMessage(error);
            console.log(err);
        } finally {
            setOtpSubmitting(false);
        }
    } // resend otp

    useEffect(() => {
        if (reSendIn > 0) {
            const timer = setTimeout(() => setReSendIn(reSendIn - 1), 1000);
            return () => clearTimeout(timer);
        }
    }) // resend timer

    return (
        <React.Fragment>
            <motion.form
                key="otp-signup"
                method='post'
                onSubmit={verifyOtpAndSignup}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
            >
                {/* Email */}
                <div>
                    <FieldLabel htmlFor="otp-email">Email</FieldLabel>
                    <TextInput
                        id="otp-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={otpEmail}
                        contentEditable={false}
                        disabled
                        leftIcon={<Mail className="h-4 w-4" />}
                    />
                </div>

                {/* Username */}
                <div>
                    <FieldLabel htmlFor="otp-username">Username</FieldLabel>
                    <TextInput
                        id="otp-username"
                        type="text"
                        autoComplete="username"
                        placeholder="your_handle"
                        value={otpUsername}
                        contentEditable={false}
                        disabled
                        leftIcon={<User className="h-4 w-4" />}
                    />
                </div>

                {/* OTP */}
                {
                    fromSignup && (
                        <div>
                            <FieldLabel htmlFor="otp-code">One-Time Password</FieldLabel>
                            <TextInput
                                id="otp-code"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="Enter the OTP"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.trim())}
                                leftIcon={<Lock className="h-4 w-4" />}
                            />
                            <p className="mt-1 text-xs opacity-70">Check your email for the OTP.</p>
                        </div>
                    )
                }

                {/* Submit */}
                {
                    fromSignup ? (
                        <PrimaryButton
                            type="submit"
                            loading={otpSubmitting}
                            disabled={otpSubmitting || !otpCode}
                            aria-busy={otpSubmitting}
                        >
                            Sign Up
                        </PrimaryButton>
                    ) : (
                        <PrimaryButton
                            type="button"
                            onClick={resendOtp}
                            loading={otpSubmitting}
                            disabled={otpSubmitting}
                            aria-busy={otpSubmitting}
                        >
                            Send OTP
                        </PrimaryButton>
                    )
                }

                <p className="text-center text-xs opacity-70">
                    By signing up you agree to our Terms & Privacy.
                </p>
                {
                    fromSignup && (
                        <p className="text-center text-xs opacity-70">
                            {
                                reSendIn > 0 ? (
                                    `Resend OTP in ${reSendIn} seconds.`
                                ) : (
                                    <span className="cursor-pointer" onClick={resendOtp}>Resend OTP</span>
                                )
                            }
                        </p>
                    )
                }
            </motion.form>
        </React.Fragment>

    )
}

export default SignupOtpForm