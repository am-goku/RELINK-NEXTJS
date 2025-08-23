"use client"

import Button from "@/components/ui/Button";
import LoaderScreen from "@/components/loaders/LoaderScreen";
import Navbar from "@/components/ui/Navbar";
import { authService } from "@/services/api/apiServices";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { getErrorMessage } from "@/lib/errors/errorResponse";
import HeroLogo from "@/components/icons/HeroLogo";

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
            console.log(err)
            setError(getErrorMessage(err) || "Something went wrong. Please try again.");
        }
    };

    return (
        <React.Fragment>
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
                <Navbar type="login" />

                <div className="flex flex-col md:flex-row p-6 md:p-10 gap-10 md:gap-28 justify-center items-center flex-1">

                    {/* Illustration Section */}
                    <HeroLogo />

                    {/* Form Section */}
                    <form
                        onSubmit={handleSubmit}
                        className="w-full md:w-1/2 max-w-md p-6 rounded-lg space-y-4 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 transition-colors duration-300"
                    >
                        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
                            Sign Up
                        </h2>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                        />

                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded pr-10 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                            />
                            <span
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-sm text-gray-500 dark:text-gray-300"
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
                            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                        />

                        <Button label="Sign Up" type="submit" />

                        <section className="flex flex-col text-gray-700 dark:text-gray-300 text-center">
                            <span>
                                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                Have an account? <a href="/auth/login" className="text-indigo-600 dark:text-indigo-400">Login.</a>
                            </span>
                        </section>
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}