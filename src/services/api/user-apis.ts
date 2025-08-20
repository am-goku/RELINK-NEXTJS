import apiInstance from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors/errorResponse";
import { IUser } from "@/models/User";
import { toggleFollower } from "@/utils/connections/user-connection";
import { Types } from "mongoose";
import React from "react";

type ProfileFormData = {
    name: string;
    username: string;
    bio: string;
    gender: string;
    links: string[]; // [website, instagram, linkedin]
};

type get_profile_Props = {
    setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setOriginalData: React.Dispatch<React.SetStateAction<Partial<ProfileFormData>>>;
    setProfilePic: React.Dispatch<React.SetStateAction<string>>;
    setCoverPic: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
};
/**
 * Fetches the current user's profile data from the API and updates the UI state accordingly.
 * @param {get_profile_Props} props - The props to update the UI state.
 * @prop {React.Dispatch<React.SetStateAction<ProfileFormData>>} setFormData - The function to update the formData state.
 * @prop {React.Dispatch<React.SetStateAction<string>>} setError - The function to update the error state.
 * @prop {React.Dispatch<React.SetStateAction<Partial<ProfileFormData>>>} setOriginalData - The function to update the originalData state.
 * @prop {React.Dispatch<React.SetStateAction<string>>} setProfilePic - The function to update the profile picture URL state.
 * @prop {React.Dispatch<React.SetStateAction<string>>} setCoverPic - The function to update the cover picture URL state.
 * @prop {React.Dispatch<React.SetStateAction<boolean>>} setIsLoading - The function to update the isLoading state.
 */
export async function getProfileData({ setFormData, setError, setOriginalData, setProfilePic, setCoverPic, setIsLoading }: get_profile_Props) {
    try {
        setIsLoading(true);
        const res = (await apiInstance.get('/api/users')).data;
        const data: ProfileFormData = {
            name: res.name || '',
            username: res.username || '',
            bio: res.bio || '',
            gender: res.gender || '',
            links: res.links || ['', '', ''],
        };

        // Updating profile pic state to manage profile picture update
        setProfilePic(res.image || '/images/default-profile.png');

        // Updating cover pic state to manage cover picture update
        setCoverPic(res.cover || '/images/default-cover.png')

        console.log("state Data::", res);

        setFormData(data);
        setOriginalData(data);
    } catch (error) {
        setError(getErrorMessage(error) || "Something went wrong. Please try again.");
    } finally {
        setIsLoading(false);
    }
}


type update_profile_Props = {
    updateUser: (user: IUser) => void;
    formData: ProfileFormData;
    originalData: Partial<ProfileFormData>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
/**
 * Updates the user's profile with the provided data.
 * @param {update_profile_Props} props - The props to update the user profile.
 * @prop {function} updateUser - The function to update the user state.
 * @prop {ProfileFormData} formData - The form data to update the user profile.
 * @prop {Partial<ProfileFormData>} originalData - The original data of the user profile.
 * @prop {React.Dispatch<React.SetStateAction<string>>} setError - The function to update the error state.
 * @prop {React.Dispatch<React.SetStateAction<boolean>>} setIsLoading - The function to update the isLoading state.
 */
export async function updateUserProfile({ updateUser, formData, originalData, setError, setIsLoading }: update_profile_Props) {
    try {
        setIsLoading(true);

        const updatedFields: Partial<ProfileFormData> = {};

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'links') {
                if (
                    Array.isArray(value) &&
                    JSON.stringify(value) !== JSON.stringify(originalData.links)
                ) {
                    updatedFields.links = value; // value is string[]
                }
            } else {
                const originalValue = originalData[key as keyof ProfileFormData];
                if (value !== originalValue) {
                    // Only assign if value is a string
                    if (typeof value === 'string') {
                        updatedFields[key as keyof Omit<ProfileFormData, 'links'>] = value;
                    }
                }
            }
        });

        if (Object.keys(updatedFields).length === 0) {
            alert('No changes to save.');
            return;
        }

        const data = new FormData();
        for (const key in updatedFields) {
            const value = updatedFields[key as keyof ProfileFormData];
            if (key === 'links' && Array.isArray(value)) {
                value.forEach((link, index) => {
                    data.append(`links[${index}]`, link);
                });
            } else if (typeof value === 'string') {
                data.append(key, value);
            }
        }
        const res = (await apiInstance.put('/api/users', data)).data;
        updateUser(res)
    } catch (error) {
        setError(getErrorMessage(error) || "Something went wrong. Please try again.");
    } finally {
        setIsLoading(false);
    }
}

/**
 * Follows the user with the provided username.
 * @param {{ username: string, setResponse: React.Dispatch<React.SetStateAction<{ action: string, success: boolean }>>, setError: React.Dispatch<React.SetStateAction<string>> }} props - The props to follow the user.
 * @prop {string} username - The username of the user to follow.
 * @prop {React.Dispatch<React.SetStateAction<{ action: string, success: boolean }>>} setResponse - The function to update the response state.
 * @prop {React.Dispatch<React.SetStateAction<string>>} setError - The function to update the error state.
 */
export async function followUser({ id, c_userId, setResponse, setUser, setError }: {
    id: Types.ObjectId,
    c_userId: string,
    setResponse?: React.Dispatch<React.SetStateAction<{ action: string, success: boolean }>>,
    setUser?: React.Dispatch<React.SetStateAction<IUser | null>>,
    setError: React.Dispatch<React.SetStateAction<string>>
}) {
    try {
        const res = (await apiInstance.patch(`/api/users/connection/${id}/follow`)).data;
        setResponse?.(res);
        toggleFollower(setUser, c_userId);
    } catch (error) {
        console.log(id, c_userId, error)
        setError(getErrorMessage(error) || "Something went wrong. Please try again.");
    }
}

/**
 * Unfollows the user with the provided username.
 * @param {{ username: string, setResponse: React.Dispatch<React.SetStateAction<{ action: string, success: boolean }>>, setError: React.Dispatch<React.SetStateAction<string>> }} props - The props to unfollow the user.
 * @prop {string} username - The username of the user to unfollow.
 * @prop {React.Dispatch<React.SetStateAction<{ action: string, success: boolean }>>} setResponse - The function to update the response state.
 * @prop {React.Dispatch<React.SetStateAction<string>>} setError - The function to update the error state.
 */
export async function unfollowUser({ id, c_userId, setResponse, setUser, setError }: {
    id: Types.ObjectId,
    c_userId: string,
    setResponse?: React.Dispatch<React.SetStateAction<{ action: string, success: boolean }>>,
    setUser?: React.Dispatch<React.SetStateAction<IUser | null>>,
    setError: React.Dispatch<React.SetStateAction<string>>
}) {
    try {
        const res = (await apiInstance.patch(`/api/users/connection/${id}/unfollow`)).data;
        setResponse?.(res);
        toggleFollower(setUser, c_userId);
    } catch (error) {
        setError(getErrorMessage(error) || "Something went wrong. Please try again.");
    }
}

/**
 * Fetches the user's profile data from the API and updates the UI state accordingly.
 * @param {{ username: string, setProfileData: React.Dispatch<React.SetStateAction<IUser>>, setIsOwner?: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<string>> }} props - The props to update the UI state.
 * @prop {string} username - The username of the user whose profile data is to be fetched.
 * @prop {React.Dispatch<React.SetStateAction<IUser>>} setProfileData - The function to update the profileData state.
 * @prop {React.Dispatch<React.SetStateAction<boolean>>} setIsOwner - The function to update the isOwner state. Optional.
 * @prop {React.Dispatch<React.SetStateAction<string>>} setError - The function to update the error state.
 */
export async function getUserProfileData({ username, setProfileData, setIsOwner, setError }: {
    username: string,
    setProfileData: React.Dispatch<React.SetStateAction<IUser | null>>,
    setIsOwner?: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string>>
}) {
    try {
        const res = (await apiInstance.get(`/api/users/${username}`)).data;
        setProfileData(res.user);
        setIsOwner?.(res.isOwner);
    } catch (error) {
        setError(getErrorMessage(error) || "Something went wrong. Please try again.");
    }
}