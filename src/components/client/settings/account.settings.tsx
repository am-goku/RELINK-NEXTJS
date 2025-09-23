import { ConfirmToggler } from '@/components/template/toggler';
import AnimatedSection from '@/components/ui/container/AnimatedSection';
import apiInstance from '@/lib/axios';
import { useUserStore } from '@/stores/userStore';
import { Lock, Mail, MessageCircle, Shield, UserX } from 'lucide-react';
import React, { useCallback, useState } from 'react';


function AccountSection() {

    const accountType = useUserStore(s => s.user?.accountType);
    const messageFrom = useUserStore(s => s.user?.messageFrom);

    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // 2FA
    const [twoFA, setTwoFA] = useState(false);

    // Search by Email
    const [searchByEmail, setSearchByEmail] = useState(false);

    // Util states
    const [loading, setLoading] = useState<boolean>(false);

    const switchAccountType = useCallback(async () => {
        try {
            await apiInstance.patch("/api/users/update/account/type");
            useUserStore.getState().updateUser("accountType", accountType === "public" ? "private" : "public");
        } catch (error) {
            console.log(error);
        }
    }, [accountType]) // Funtion-Use: Update account type to Private or Public

    const switchMessageFrom = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        try {
            const value = e.target.value as 'everyone' | 'followers' | 'none';
            // TODO: add API call here
            useUserStore.getState().updateUser("messageFrom", value);
        } catch (error) {
            console.log(error);
        }
    } // Funtion-Use: Update message between everyone or followers or none

    const switchTwoFA = useCallback(async () => {
        try {
            // TODO: add API call here
            setTwoFA(!twoFA);
        } catch (error) {
            console.log(error);
        }
    }, [twoFA])

    const switchSearchByEmail = useCallback(async () => {
        try {
            // TODO: add API call here
            setSearchByEmail(!searchByEmail);
        } catch (error) {
            console.log(error);
        }
    }, [searchByEmail])

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
    }; // TODO: add deactivate account API call

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
    }; // TODO: add delete account API call

    return (
        <React.Fragment>
            <div className="space-y-6 px-2 md:px-0 pb-2">
                {/* Privacy & Security Section */}
                <AnimatedSection title="Privacy & Security" icon={Shield}>
                    <div className="flex items-center justify-between">
                        <span>Private Account</span>
                        {/* <input type="checkbox" className="toggle toggle-primary" /> */}
                        <ConfirmToggler
                            title={`Switch to ${accountType === 'public' ? 'Public' : 'Private'} Account`}
                            value={accountType === 'private'}
                            onConfirm={switchAccountType}
                            confirmText="Switch"
                            messageBuilder={() => `Are you sure you want to switch to ${accountType === 'public' ? 'Public' : 'Private'} account?`}
                        />
                    </div> {/** Account Type Toggler */}

                    <div className="flex items-center justify-between">
                        <span>Two-Factor Authentication</span>
                        <ConfirmToggler
                            title={`${twoFA ? 'Disable' : 'Enable'} Two-Factor Authentication`}
                            value={twoFA}
                            onConfirm={switchTwoFA}
                            confirmText={`${twoFA ? 'Disable' : 'Enable'}`}
                            messageBuilder={() => `Are you sure you want to ${twoFA ? 'disable' : 'enable'} Two-Factor Authentication?`}
                        />
                    </div> {/** 2FA Toggler */}

                    <div className="flex items-center justify-between">
                        <span>Allow Search by Email</span>
                        <ConfirmToggler
                            title={`${searchByEmail ? 'Disable' : 'Enable'} Search by Email`}
                            value={searchByEmail}
                            onConfirm={switchSearchByEmail}
                            confirmText={`${searchByEmail ? 'Disable' : 'Enable'}`}
                            messageBuilder={() => `Are you sure you want to ${searchByEmail ? 'disable' : 'enable'} Search by Email?`}
                        />
                    </div> {/** Allow Search by Email Toggler */}
                </AnimatedSection>

                {/* Who Can Message Section */}
                <AnimatedSection title="Who Can Message You" icon={MessageCircle}>
                    <div className="flex items-center justify-between">
                        <span>Message Permissions</span>
                        <select value={messageFrom} onChange={switchMessageFrom} className="ml-auto border border-gray-300 px-3 py-1 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                            <option value={'followers'}>Followers Only</option>
                            <option value={'everyone'}>Everyone</option>
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
                            className="px-5 py-2 rounded-xl border border-red-600 text-red-600 hover:bg-red-500x` hover:text-white dark:border-red-600 dark:text-red-600 dark:hover:bg-red-500 dark:hover:text-white transition"
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
                </AnimatedSection>
            </div>


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
        </React.Fragment>
    )
}

export default AccountSection