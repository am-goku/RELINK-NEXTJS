'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError(result.error);
        } else {
            // Redirect to dashboard or home on successful login
            router.push('/');
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
                            <span
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-sm text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </span>
                        </div>
                        <Button label='Sign In' type='submit' />
                        <section className='flex flex-col gap-2'>
                            <span>New here? <Link href="/auth/signup" className='text-indigo-700'>Signup.</Link></span>
                            <a href='#' className='text-indigo-700'>Forgot password?</a>
                        </section>
                    </form>
                </div>
            </div>
        </>
    );
}
