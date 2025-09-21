import AnimatedSection from '@/components/ui/container/AnimatedSection'
import { useTheme } from '@/context/ThemeContext';
import { Bell, Eye, Shield, SlidersHorizontal } from 'lucide-react'
import React from 'react'

function InterfaceSection() {

    const { theme, toggleTheme } = useTheme();

    return (
        <React.Fragment>
            <div className="rounded-2xl p-6 space-y-4">
                {/* Notification Section */}
                <AnimatedSection title="Notifications" icon={Bell}>
                    <div className="flex items-center justify-between">
                        <span>Email Notifications</span>
                        <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Push Notifications</span>
                        <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Vibrate on Notification</span>
                        <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                </AnimatedSection>

                {/* Accessibility Section */}
                <AnimatedSection title="Accessibility" icon={Eye}>
                    <div className="flex items-center justify-between">
                        <span>Dark Mode</span>
                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${theme === "light"
                                ? "bg-gray-400 dark:bg-gray-600"
                                : "bg-blue-600"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${theme === "dark" ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Font Size</label>
                        <select className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>High Contrast</span>
                        <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                </AnimatedSection>

                {/* Privacy & Security Section */}
                <AnimatedSection title="Privacy & Security" icon={Shield}>
                    <div className="flex items-center justify-between">
                        <span>Private Account</span>
                        <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Two-Factor Authentication</span>
                        <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Allow Search by Email</span>
                        <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </div>
                </AnimatedSection>

                {/* App Preferences Section */}
                <AnimatedSection title="App Preferences" icon={SlidersHorizontal}>
                    <div className="flex items-center justify-between">
                        <span>Auto-play Videos</span>
                        <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Language</span>
                        <select className="ml-auto border border-gray-300 dark:border-neutral-700 px-3 py-1 rounded-md dark:bg-neutral-800 dark:text-gray-200" defaultValue="en">
                            <option value="es">Spanish</option>
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Data Saver Mode</span>
                        <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                </AnimatedSection>
            </div>
        </React.Fragment>
    )
}

export default InterfaceSection