"use client";

import { useUser } from "@/context/UserContext";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Menu, X, Home, Compass, MessageCircle } from "lucide-react";

const Navigation = ({ session }: { session: Session }) => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <React.Fragment>
      <div className="relative flex items-center gap-4 text-sm font-medium">
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/"
            className="px-3 py-2 rounded hover:bg-primary dark:hover:bg-primary-dark transition-colors"
          >
            Home
          </Link>
          <Link
            href="/explore"
            className="px-3 py-2 rounded hover:bg-primary dark:hover:bg-primary-dark transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/chat"
            className="px-3 py-2 rounded hover:bg-primary dark:hover:bg-primary-dark transition-colors"
          >
            Chat
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden p-2 rounded hover:bg-primary dark:hover:bg-primary-dark transition-colors"
        >
          {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-primary dark:hover:bg-primary-dark focus:outline-none transition-colors"
          >
            <Image
              src={user?.image || "/images/default-profile.png"}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <span className="hidden md:inline text-sm font-medium">
              {user?.name || user?.username}
            </span>
            <svg
              className="w-4 h-4 ml-1 text-gray-500 dark:text-gray-300 hidden md:block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 transition-colors">
              <Link
                href={`/${session.user.username}`}
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                My Profile
              </Link>
              <Link
                href="/settings/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenu && (
        <div className="absolute top-20 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-md md:hidden z-40">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5" /> Home
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Compass className="w-5 h-5" /> Explore
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <MessageCircle className="w-5 h-5" /> Chat
          </Link>
        </div>
      )}
    </React.Fragment>
  );
};

export default Navigation;
