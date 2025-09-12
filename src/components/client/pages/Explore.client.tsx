'use client';

import React from 'react';
import { Session } from 'next-auth'
import { UserPlus } from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import Navbar from '../../ui/navbar/Navbar';
import { useRouter } from 'next/navigation';

const suggestedUsers = [
  { id: 1, name: 'Ava Johnson', username: 'avaj', avatar: '/images/default-profile.png' },
  { id: 2, name: 'Liam Brown', username: 'liamb', avatar: '/images/default-profile.png' },
  { id: 3, name: 'Noah Smith', username: 'noahsmith', avatar: '/images/default-profile.png' },
];
const mockPosts = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  imageUrl: '/images/bannerImg.jpg',
}));


type Props = {
  session: Session | null
}

function ExploreClient({ session }: Props) {

  const router = useRouter();

  return (
    <React.Fragment>
      <div className="flex flex-col flex-grow px-2 sm:px-4 pt-20 min-h-screen 
                  bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text transition-colors">
        <Navbar type="explore" session={session} />

        <div className="px-2 sm:px-4 py-4 sm:py-6 max-w-6xl mx-auto w-full">
          {/* Search bar */}
          <SearchBar />

          {/* Suggested Users */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
              Suggested for you
            </h2>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {suggestedUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => router.push(`/${user.username}`)}
                  className="flex-shrink-0 bg-gray-100 dark:bg-neutral-800 cursor-pointer 
                         rounded-xl p-3 sm:p-4 w-48 sm:w-60 flex items-center gap-3 sm:gap-4 
                         shadow-sm transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      @{user.username}
                    </p>
                  </div>
                  <button className="p-1 text-primary hover:text-primary-dark transition-colors">
                    <UserPlus size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div>
            <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
              Trending Posts
            </h2>
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {mockPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative group overflow-hidden rounded-lg sm:rounded-xl shadow-sm"
                >
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
    </React.Fragment>

  )
}

export default ExploreClient