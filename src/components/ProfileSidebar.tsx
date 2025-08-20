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
    <div className="bg-white rounded-lg shadow-md p-4 space-y-3 w-[20rem] h-full">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`block w-full text-left px-3 py-2 rounded font-medium ${isActive
              ? 'bg-[#6C5CE7] text-white'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            {item.label}
          </button>
        );
      })}
      <hr />
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="block w-full text-left px-3 py-2 rounded hover:bg-red-100 text-red-500 font-semibold"
      >
        Logout
      </button>

      {showLogoutConfirm &&
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-w-full">
            <h4 className="text-lg font-semibold mb-4 text-[#2D3436]">LogOut?</h4>
            <p className="text-[#636E72] mb-6">
              Are you sure you want to logout your account?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300"
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
        </div>}

    </div>
  );
}
