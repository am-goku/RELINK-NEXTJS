'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/components/ui/navbar/Navbar';
import SearchBar from '@/components/search/SearchBar';
import UserResults from '@/components/search/UserResults';
import PostResults from '@/components/search/PostResults';
import { useSession } from 'next-auth/react';

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';
    const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
    const {data: session} = useSession();

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Navbar type="explore" session={session} />
                <main className="px-4 py-6 max-w-6xl mx-auto text-[#2D3436] space-y-8">

                    {/* Search Bar */}
                    <SearchBar searchKey={query} />

                    {/* Toggle Tabs */}
                    <div className="flex gap-4 border-b border-gray-300">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`py-2 px-4 font-medium ${activeTab === 'users' ? 'border-b-2 border-[#6C5CE7] text-[#6C5CE7]' : 'text-gray-500'
                                }`}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`py-2 px-4 font-medium ${activeTab === 'posts' ? 'border-b-2 border-[#6C5CE7] text-[#6C5CE7]' : 'text-gray-500'
                                }`}
                        >
                            Posts
                        </button>
                    </div>

                    {/* Results */}
                    {activeTab === 'users' ? (
                        <UserResults query={query} />
                    ) : (
                        <PostResults query={query} />
                    )}
                </main>
            </div>
        </>
    );
}
