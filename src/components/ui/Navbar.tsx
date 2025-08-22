'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import RelinkLogo from '../icons/RelinkLogo'
import Image from 'next/image'
import { Session } from 'next-auth'
import { useUser } from '@/providers/UserProvider'

interface NavProps {
  type: 'home' | 'explore' | 'chat' | 'profile' | 'login'
}

const Navbar: React.FC<NavProps> = ({ type }) => {

  const { data: session } = useSession();

  
  useEffect(() => {
    document.getElementById(type)?.classList.add('bg-[#6C5CE7]');
  }, [type])

  function goHome() {
    window.location.href = '/';
  }

  return (
    <nav className="p-4 px-5 h-20">
      <div className="flex justify-between items-center h-full">
        <RelinkLogo height={40} width={40} onClick={goHome} />
        {
          session && <Navigation session={session} />
        }
      </div>
    </nav>
  )
}

const Navigation = ({ session }: { session: Session }) => {
  const { user } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-4 text-sm font-medium">
      <Link id="home" href="/" className="px-4 py-2 rounded hover:bg-[#6C5CE7]">Home</Link>
      <Link id="explore" href="/explore" className="px-4 py-2 rounded hover:bg-[#6C5CE7]">Explore</Link>
      <Link id="chat" href="/chat" className="px-4 py-2 rounded hover:bg-[#6C5CE7]">Chat</Link>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#6C5CE7] focus:outline-none"
        >
          <Image
            src={user?.image || '/images/default-profile.png'}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <span className="hidden md:inline text-sm font-medium">{user?.name || user?.username}</span>
          <svg
            className="w-4 h-4 ml-1 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <Link
              href={`/${session.user.username}`}
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              My Profile
            </Link>
            <Link
              href="/settings/profile"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Settings
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar
