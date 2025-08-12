import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function UserNotFound() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">User Not Found</h2>
                <p className="text-gray-500 mb-6">
                    Sorry, the user you are looking for doesn’t exist or may have been removed.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>
        </main>
    );
}