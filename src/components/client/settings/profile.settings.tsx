'use client';

import AnimatedSection from '@/components/ui/container/AnimatedSection';
import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getErrorMessage } from '@/lib/errors/errorResponse';
import apiInstance from '@/lib/axios';

type ProfileFormData = {
    name: string;
    username: string;
    bio: string;
    gender: "male" | "female" | "non-binary" | "other" | "prefer-not-to-say" | "";
};

function ProfileSection() {
    const [formData, setFormData] = useState<ProfileFormData>({
        name: '',
        username: '',
        bio: '',
        gender: '',
    });

    const [originalData, setOriginalData] = useState<ProfileFormData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // Fetch user data on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = (await apiInstance.get('/api/auth/user')).data; // your API endpoint
                setFormData({
                    bio: res.bio || '',
                    gender: res.gender || '',
                    name: res.name || '',
                    username: res.username || ''
                });
                setOriginalData({
                    bio: res.bio || '',
                    gender: res.gender || '',
                    name: res.name || '',
                    username: res.username || ''
                });
            } catch (err) {
                setError(getErrorMessage(err) || 'Failed to fetch profile');
            }
        };

        fetchUser();
    }, []);

    // Track changes
    const isChanged = originalData
        ? JSON.stringify(formData) !== JSON.stringify(originalData)
        : false;

    // Validation
    const validate = (): string | null => {
        if (!formData.name.trim()) return 'Name is required';
        if (!formData.username.trim()) return 'Username is required';
        if (formData.username.length < 3) return 'Username must be at least 3 characters';
        return null;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Update profile
    const handleUpdate = async () => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setIsLoading(true);
            const res = await apiInstance.put('/api/users', formData); // your API endpoint
            setFormData({
                bio: res.data.user.bio || '',
                gender: res.data.user.gender || '',
                name: res.data.user.name || '',
                username: res.data.user.username || '',
            });
            setOriginalData({
                bio: res.data.user.bio || '',
                gender: res.data.user.gender || '',
                name: res.data.user.name || '',
                username: res.data.user.username || '',
            }); // update reference
        } catch (err) {
            console.log(err)
            setError(getErrorMessage(err) || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    // Show error instantly (you could also use toast instead of alert)
    useEffect(() => {
        if (error) {
            console.log(error);
            setError('');
        }
    }, [error]);

    return (
        <React.Fragment>
            <div className="space-y-6 px-2 md:px-0">
                <AnimatedSection title="Basic Info" icon={User}>
                    <div className="space-y-3">
                        <div id="full_name">
                            <label className="text-sm font-medium block mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200 rounded-md"
                            />
                        </div>
                        <div id="username">
                            <label className="text-sm font-medium block mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200 rounded-md"
                            />
                        </div>
                        <div id="bio">
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
                        <div id="gender">
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
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="non-binary">Non-binary</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleUpdate}
                                disabled={!isChanged || isLoading}
                                className={`mt-4 px-6 py-2 rounded-md bg-[#6C5CE7] text-white 
                  hover:bg-[#5A4BD3] dark:bg-[#5A4BD3] dark:hover:bg-[#483ab8] 
                  disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isLoading ? 'Saving changes...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </React.Fragment>
    );
}

export default ProfileSection;
