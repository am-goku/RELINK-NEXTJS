'use client';

import React, { useState } from 'react';
import {
    Shield,
    Mail,
    Lock,
    MessageCircle,
    UserX,
} from 'lucide-react';
import LoadingContent from '@/components/ui/loaders/LoadingContent';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { useUser } from '@/context/UserContext';
import PrivacySection from '@/components/settings/PrivacySection';
import { Session } from 'next-auth';

type Props = {
    session: Session | null;
}

function AccountClient({  }: Props) {
    const { user, setUser } = useUser(); // setUser function from user context

    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Util states
    const [loading, setLoading] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [pageLoading, setPageLoading] = useState<boolean>(false);

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
        <LoadingContent isLoading={pageLoading}>
            <div className="max-w-2xl mx-auto py-10 px-4 md:px-0 text-[#2D3436] dark:text-gray-200">
                {/* Account Privacy Section */}
                <AnimatedSection title="Privacy" icon={Shield}>
                    <PrivacySection accountType={user?.accountType} onlineStatus={user?.onlineStatus} setUser={setUser} />
                </AnimatedSection>

                {/* Who Can Message Section */}
                <AnimatedSection title="Who Can Message You" icon={MessageCircle}>
                    <div>
                        <label className="text-sm font-medium block mb-1">Message Permissions</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                            <option value={'everyone'}>Everyone</option>
                            <option value={'followers'}>Followers Only</option>
                            <option value={'none'}>No One</option>
                        </select>
                    </div>
                </AnimatedSection>

                {/* Change Email Section */}
                <AnimatedSection title="Change Email" icon={Mail}>
                    <div>
                        <label className="text-sm font-medium block mb-1">New Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                        />
                    </div>
                    <button className="mt-2 px-4 py-2 rounded-md bg-[#6C5CE7] text-white hover:bg-[#5A4BD3] dark:bg-[#5A4BD3] dark:hover:bg-[#483ab8]">
                        Update Email
                    </button>
                </AnimatedSection>

                {/* Change Password Section */}
                <AnimatedSection title="Change Password" icon={Lock}>
                    <div className="space-y-3">
                        {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => (
                            <div key={i}>
                                <label className="text-sm font-medium block mb-1">{label}</label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                />
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 px-4 py-2 rounded-md bg-[#6C5CE7] text-white hover:bg-[#5A4BD3] dark:bg-[#5A4BD3] dark:hover:bg-[#483ab8]">
                        Update Password
                    </button>
                </AnimatedSection>

                {/* Account Ownership and Control */}
                <AnimatedSection title="Account Ownership & Control" icon={UserX}>
                    <p className="text-sm text-[#636E72] dark:text-gray-400 mb-4 max-w-xl">
                        Manage your account status here. You can temporarily deactivate your account or permanently delete it. Deleting your account is irreversible.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowDeactivateConfirm(true)}
                            disabled={loading}
                            className="px-5 py-2 rounded-xl border border-[#6C5CE7] text-[#6C5CE7] hover:bg-[#6C5CE7] hover:text-white dark:border-[#5A4BD3] dark:text-[#5A4BD3] dark:hover:bg-[#5A4BD3] dark:hover:text-white transition"
                        >
                            Deactivate Account
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={loading}
                            className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition"
                        >
                            Delete Account
                        </button>
                    </div>

                    {/* Deactivate Confirmation Modal */}
                    {showDeactivateConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-96 max-w-full text-[#2D3436] dark:text-gray-200">
                                <h4 className="text-lg font-semibold mb-4">Confirm Deactivation</h4>
                                <p className="text-[#636E72] dark:text-gray-400 mb-6">
                                    Are you sure you want to deactivate your account? You can reactivate it anytime by logging back in.
                                </p>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setShowDeactivateConfirm(false)}
                                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeactivate}
                                        className="px-4 py-2 rounded-lg bg-[#6C5CE7] text-white hover:bg-[#5941c6] dark:bg-[#5A4BD3] dark:hover:bg-[#483ab8]"
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
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-96 max-w-full text-[#2D3436] dark:text-gray-200">
                                <h4 className="text-lg font-semibold mb-4">Confirm Deletion</h4>
                                <p className="text-[#636E72] dark:text-gray-400 mb-6">
                                    Deleting your account is permanent and cannot be undone. All your data will be lost. Are you absolutely sure?
                                </p>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                                        disabled={loading}
                                    >
                                        {loading ? "Processing..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </AnimatedSection>
            </div>

        </LoadingContent>
    )
}

export default AccountClient