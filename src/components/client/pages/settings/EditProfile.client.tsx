'use client';

import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { getProfileData, updateUserProfile } from '@/services/api/user-apis';
import LoadingContent from '@/components/ui/loaders/LoadingContent';
import { useUser } from '@/context/UserContext';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { LinksSection } from '@/components/settings/LinkSection';
import { Session } from 'next-auth';

type Props = {
    session: Session | null;
}

type ProfileFormData = {
    name: string;
    username: string;
    bio: string;
    gender: string;
    links: string[]; // [website, instagram, linkedin]
};


function EditProfileClient({ }: Props) {

    // State Management
    const { user, setUser } = useUser()

    // Util states
    const [error, setError] = useState<string>('');
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [originalData, setOriginalData] = useState<Partial<ProfileFormData>>({ ...user });
    const [formData, setFormData] = useState<ProfileFormData>({
        name: '',
        username: '',
        bio: '',
        gender: '',
        links: ['', '', ''],
    });

    // Fetching Current User Data 
    useEffect(() => {
        if (user) {
            getProfileData({ setFormData, setError, setOriginalData, setIsLoading: setPageLoading });
        }
    }, [user]);

    // Error Handling
    useEffect(() => {
        if (error) {
            alert(error);
            setError('');
        }
    }, [error]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <LoadingContent isLoading={pageLoading}>
            <div className="max-w-2xl mx-auto py-10 px-4 md:px-0 text-gray-800 dark:text-gray-200">
                <AnimatedSection title="Basic Info" icon={User}>
                    <div className="space-y-3">
                        <React.Fragment>
                            <div id='full_name'>
                                <label className="text-sm font-medium block mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200 rounded-md"
                                />
                            </div>
                            <div id='username'>
                                <label className="text-sm font-medium block mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200 rounded-md"
                                />
                            </div>
                            <div id='bio'>
                                <label className="text-sm font-medium block mb-1">Bio</label>
                                <textarea
                                    rows={3}
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us something about you..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200 rounded-md resize-none"
                                />
                            </div>
                            <div id='gender'>
                                <label className="text-sm font-medium block mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200 rounded-md"
                                >
                                    <option value="" disabled>
                                        Select your gender
                                    </option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Non-binary</option>
                                    <option>Prefer not to say</option>
                                </select>
                            </div>
                        </React.Fragment>
                        <div className="flex justify-end">
                            <button
                                onClick={() =>
                                    updateUserProfile({ formData, originalData, updateUser: setUser, setError, setIsLoading })
                                }
                                className={`mt-4 px-6 py-2 rounded-md bg-[#6C5CE7] text-white hover:bg-[#5A4BD3] dark:bg-[#5A4BD3] dark:hover:bg-[#483ab8] disabled:opacity-50 disabled:cursor-not-allowed`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving changes...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </AnimatedSection>

                <LinksSection updateUser={setUser} formData={formData} setFormData={setFormData} />
            </div>
        </LoadingContent>
    )
}

export default EditProfileClient;