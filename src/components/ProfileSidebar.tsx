'use client'

import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import React, { useState } from 'react';

export default function ProfileSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const navItems = [
    { label: 'Profile', href: '/settings/profile' },
    { label: 'Settings', href: '/settings' },
    { label: 'Account', href: '/settings/account' },
    { label: 'Privacy Policy', href: '/settings/privacy' },
    { label: 'Help & Support', href: '/settings/help' },
  ];

  const LogOut = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signOut();
    }, 1500);
  }

  return (
    <React.Fragment>
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-4 space-y-3 w-[20rem] h-full text-gray-800 dark:text-gray-200">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`block w-full text-left px-3 py-2 rounded font-medium ${isActive
                  ? 'bg-[#6C5CE7] text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
            >
              {item.label}
            </button>
          );
        })}

        <hr className="border-gray-300 dark:border-neutral-700" />

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="block w-full text-left px-3 py-2 rounded hover:bg-red-100 dark:hover:bg-red-800 text-red-500 font-semibold"
        >
          Logout
        </button>

        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-96 max-w-full text-gray-800 dark:text-gray-200">
              <h4 className="text-lg font-semibold mb-4">LogOut?</h4>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Are you sure you want to logout your account?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={LogOut}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </React.Fragment>
  );
}
