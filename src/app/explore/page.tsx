'use client';

import React from 'react';
import { UserPlus } from 'lucide-react';
import Navbar from '../../components/Navbar';
import SearchBar from '@/components/search/SearchBar';

const suggestedUsers = [
    { id: 1, name: 'Ava Johnson', username: 'avaj', avatar: '/images/default-profile.png' },
    { id: 2, name: 'Liam Brown', username: 'liamb', avatar: '/images/default-profile.png' },
    { id: 3, name: 'Noah Smith', username: 'noahsmith', avatar: '/images/default-profile.png' },
];
const mockPosts = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    imageUrl: '/images/bannerImg.jpg',
}));



export default function ExplorePage() {


    return (
        <div className="flex flex-col min-h-screen">
            <Navbar type='explore' />
            <div className="px-4 py-6 max-w-6xl mx-auto text-[#2D3436]">

                {/* Search bar */}
                <SearchBar />


                {/* Suggested Users */}
                <div className="mb-8">
                    <h2 className="text-lg font-medium mb-4">Suggested for you</h2>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {suggestedUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex-shrink-0 bg-[#F0F2F5] rounded-xl p-4 w-60 flex items-center gap-4 shadow-sm"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-grow">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-[#636E72]">@{user.username}</p>
                                </div>
                                <button className="p-1 text-[#6C5CE7] hover:text-opacity-80 transition">
                                    <UserPlus size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Posts Grid */}
                <div>
                    <h2 className="text-lg font-medium mb-4">Trending Posts</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {mockPosts.map((post) => (
                            <div key={post.id} className="relative group overflow-hidden rounded-xl shadow-sm">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={post.imageUrl}
                                    alt={`Post ${post.id}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
