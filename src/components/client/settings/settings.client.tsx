'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/nav/header';
import PrivacyPolicy from '@/components/client/settings/privacy.settings';
import HelpSupport from '@/components/client/settings/support.settings';
import InterfaceSection from '@/components/client/settings/interface.settings';
import AccountSection from '@/components/client/settings/account.settings';
import SettingsSidebar from '@/components/client/settings/sidebar.settings';
import ProfileSection from '@/components/client/settings/profile.settings';
import { Session } from 'next-auth';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
    session: Session;
}

type Tab = 'edit-profile' | 'account' | 'interface' | 'privacy-policy' | 'help-support';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SettingsClient({ session }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const tabFromQuery = (searchParams.get("tab") as Tab) || "edit-profile";
    const activeTab = tabFromQuery;

    const setActiveTab = (tab: Tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        router.replace(`/settings?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] dark:bg-neutral-900 text-[#2D3436] dark:text-gray-200">
            {/* Header */}
            <Header page="settings" />

            <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-6 gap-6">
                {/* Sidebar / Horizontal Tabs on Mobile */}
                <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Content */}
                <main className="flex-1 space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                            {/* Edit Profile */}
                            {activeTab === 'edit-profile' && (
                                <ProfileSection />
                            )}

                            {/* Account */}
                            {activeTab === 'account' && (
                                <AccountSection />
                            )}

                            {/* Interface */}
                            {activeTab === 'interface' && (
                                <InterfaceSection />
                            )}

                            {/* Privacy Policy */}
                            {activeTab === 'privacy-policy' && (
                                <PrivacyPolicy />
                            )}

                            {/* Help & Support */}
                            {activeTab === 'help-support' && (
                                <HelpSupport />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}