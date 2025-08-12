"use client"

import Button from "@/components/ui/Button";
import LoaderScreen from "@/components/loaders/LoaderScreen";
import Navbar from "@/components/ui/Navbar";
import { authService } from "@/services/api/apiServices";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { data: session, status } = useSession();

    // If session is loading, return a loading state
    if (status === 'loading') {
        return <LoaderScreen />;
    }

    // If no session, redirect to login page
    if (session) {
        router.push('/');
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { email, username, password, confirmPassword } = formData;

        if (!email || !username || !password || !confirmPassword) {
            return setError("All fields are required.");
        }

        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        try {
            await authService.register({ email, username, password });
            router.push("/auth/login"); // redirect to login
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Something went wrong.");
            } else {
                setError("An unexpected error occurred.");
            }
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
                        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                        />

                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded pr-10"
                            />
                            <span
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-sm text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </span>
                        </div>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                        />

                        <Button label="Sign Up" type="submit" />
                        <section className='flex flex-col'>
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <span>Have an account? <a href="/auth/login" className='text-indigo-700'>Login.</a></span>
                        </section>
                    </form>
                </div>
            </div>
        </>
    )
}