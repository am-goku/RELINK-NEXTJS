'use client'

import React, { useState } from 'react';
import Navbar from '@/components/ui/navbar/Navbar';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import HeroLogo from '@/components/icons/HeroLogo';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


function LoginClient() {

    const router = useRouter();
    const {data: session} = useSession();

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Utils States
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setError('');
            setLoading(true);

            if (!email || !password) {
                throw new Error("Please enter both email and password.")
            }

            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            console.log(result)

            if (result?.error) {
                throw new Error(result.error);
            }

            if (result?.ok && !result.error) {
                router.push("/");
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || "An error occurred. Please try again.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <React.Fragment>
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
                <Navbar type="login" session={session} />

                <div className="flex flex-col md:flex-row p-6 md:p-10 gap-10 md:gap-28 justify-center items-center flex-1">

                    {/* Banner Section - hidden on small screens */}
                    <HeroLogo />

                    {/* Form Section */}
                    <form
                        onSubmit={handleSubmit}
                        className="w-full md:w-1/2 max-w-md p-6 rounded-lg space-y-4 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 transition-colors duration-300"
                    >
                        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
                            Sign In
                        </h2>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded pr-10 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-300"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>

                        <Button label="Sign In" type="submit" loading={loading} />

                        <section className="flex flex-col gap-2 text-center text-gray-700 dark:text-gray-300">
                            <span>
                                New here? <Link href="/auth/signup" className="text-indigo-600 dark:text-indigo-400">Signup</Link>
                            </span>
                            <Link href="/forgot-password" className="text-indigo-600 dark:text-indigo-400">
                                Forgot password?
                            </Link>
                        </section>
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}

export default LoginClient