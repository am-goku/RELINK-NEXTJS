'use client';

import React, { useState } from 'react';
import {
  Shield,
  Mail,
  Lock,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  UserX,
} from 'lucide-react';

function AccountSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3 text-[#2D3436] font-semibold">
          <Icon className="text-[#6C5CE7]" size={20} />
          <h2>{title}</h2>
        </div>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {open && <div className="mt-4 space-y-4">{children}</div>}
    </div>
  );
}

export default function AccountPage() {

  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      // TODO: add deactivate account API call here
      alert("Account deactivated successfully.");
    } catch (error) {
      console.log(error)
      alert("Failed to deactivate account.");
    } finally {
      setLoading(false);
      setShowDeactivateConfirm(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      // TODO: add delete account API call here
      alert("Account deleted successfully.");
    } catch (error) {
      console.log(error)
      alert("Failed to delete account.");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 md:px-0 text-[#2D3436]">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      {/* Account Privacy Section */}
      <AccountSection title="Privacy" icon={Shield}>
        <div className="flex items-center justify-between">
          <span>Private Account</span>
          <input type="checkbox" className="toggle toggle-primary" />
        </div>
        <div className="flex items-center justify-between">
          <span>Show Online Status</span>
          <input type="checkbox" className="toggle toggle-primary" defaultChecked />
        </div>
      </AccountSection>

      {/* Who Can Message Section */}
      <AccountSection title="Who Can Message You" icon={MessageCircle}>
        <div>
          <label className="text-sm font-medium block mb-1">Message Permissions</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option selected>Everyone</option>
            <option>Followers Only</option>
            <option>No One</option>
          </select>
        </div>
      </AccountSection>

      {/* Change Email Section */}
      <AccountSection title="Change Email" icon={Mail}>
        <div>
          <label className="text-sm font-medium block mb-1">New Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button className="mt-2 px-4 py-2 rounded-md bg-[#6C5CE7] text-white hover:bg-[#5A4BD3]">
          Update Email
        </button>
      </AccountSection>

      {/* Change Password Section */}
      <AccountSection title="Change Password" icon={Lock}>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">Current Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button className="mt-4 px-4 py-2 rounded-md bg-[#6C5CE7] text-white hover:bg-[#5A4BD3]">
          Update Password
        </button>
      </AccountSection>

      {/* Account Ownership and Control */}
      <AccountSection title="Account Ownership & Control" icon={UserX}>
        <p className="text-sm text-[#636E72] mb-4 max-w-xl">
          Manage your account status here. You can temporarily deactivate your account or permanently delete it. Deleting your account is irreversible.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowDeactivateConfirm(true)}
            disabled={loading}
            className="px-5 py-2 rounded-xl border border-[#6C5CE7] text-[#6C5CE7] hover:bg-[#6C5CE7] hover:text-white transition"
          >
            Deactivate Account
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete Account
          </button>
        </div>

        {/* Deactivate Confirmation Modal */}
        {showDeactivateConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 max-w-full">
              <h4 className="text-lg font-semibold mb-4 text-[#2D3436]">Confirm Deactivation</h4>
              <p className="text-[#636E72] mb-6">
                Are you sure you want to deactivate your account? You can reactivate it anytime by logging back in.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  className="px-4 py-2 rounded-lg bg-[#6C5CE7] text-white hover:bg-[#5941c6]"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Deactivate"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 max-w-full">
              <h4 className="text-lg font-semibold mb-4 text-[#2D3436]">Confirm Deletion</h4>
              <p className="text-[#636E72] mb-6">
                Deleting your account is permanent and cannot be undone. All your data will be lost. Are you absolutely sure?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </AccountSection>
    </div>
  );
}
