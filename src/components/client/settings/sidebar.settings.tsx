import React from 'react'
import { motion } from 'framer-motion'
import { User, Settings, Shield, HelpCircle, Monitor } from 'lucide-react';


const tabs: { id: Tab, label: string, icon: React.ElementType }[] = [
    { id: 'edit-profile', label: 'Edit Profile', icon: User },
    { id: 'account', label: 'Account', icon: Settings },
    { id: 'interface', label: 'Interface', icon: Monitor },
    { id: 'privacy-policy', label: 'Privacy Policy', icon: Shield },
    { id: 'help-support', label: 'Help & Support', icon: HelpCircle },
];

type Tab = 'edit-profile' | 'account' | 'interface' | 'privacy-policy' | 'help-support';

type Props = {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

function SettingsSidebar({ activeTab, setActiveTab }: Props) {
    return (
        <React.Fragment>
            <aside className="flex md:flex-col justify-around md:justify-start w-full md:w-1/4 mb-4 md:mb-0">
                {tabs.map(({ id, icon: Icon }) => (
                    <motion.button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center md:justify-start justify-center md:gap-3 p-3 rounded-xl transition-all ${activeTab === id ? 'bg-blue-50 dark:bg-gray-800 font-semibold shadow' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="hidden md:inline">{id.replace('-', ' ')}</span>
                    </motion.button>
                ))}
            </aside>
        </React.Fragment>
    )
}

export default SettingsSidebar