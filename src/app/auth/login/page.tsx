'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import Link from 'next/link';

export default function LoginPage() {
    const { status } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/');
        }
    }, [status, router]);

    if (status === 'loading' || status === 'authenticated') return null;

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
        <>
            <div className="min-h-screen items-center justify-center">
                <Navbar type="login" />
                <div className="flex p-10 gap-28 justify-center">

                    <section className="w-1/2 h-[80vh] relative">
                        <Image
                            src="/images/bannerImg.jpg"
                            alt="Banner"
                            fill
                            className="object-cover rounded-l-lg"
                            priority
                        />
                    </section>

                    <form
                        onSubmit={handleSubmit}
                        className="w-1/2 max-w-md p-6 rounded-lg space-y-4"
                    >
                        <h2 className="text-2xl font-bold text-center">Sign In</h2>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 p-2 rounded pr-10"
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        <Button label='Sign In' type='submit' disabled={loading} />
                        <section className='flex flex-col gap-2'>
                            <span>New here? <Link href="/auth/signup" className='text-indigo-700'>Signup</Link></span>
                            <Link href="/forgot-password" className="text-indigo-700">Forgot password?</Link>
                        </section>
                    </form>
                </div>
            </div>
        </>
    );
}
