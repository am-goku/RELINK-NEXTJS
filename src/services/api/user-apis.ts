import apiInstance from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors/errorResponse";
import { SanitizedUser } from "@/utils/sanitizer/user";
import { Types } from "mongoose";
import React, { Dispatch, SetStateAction } from "react";

type ProfileFormData = {
    name: string;
    username: string;
    bio: string;
    gender: string;
    links: string[]; // [website, instagram, linkedin]
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
export async function getProfileData({ setFormData, setError, setOriginalData, setIsLoading }: {
    setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setOriginalData: React.Dispatch<React.SetStateAction<Partial<ProfileFormData>>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}) {
    try {
        setIsLoading(true);
        const res = (await apiInstance.get('/api/users')).data.user;
        const data: ProfileFormData = {
            name: res.name || '',
            username: res.username || '',
            bio: res.bio || '',
            gender: res.gender || '',
            links: res.links || ['', '', ''],
        };

        setFormData(data);
        setOriginalData(data);
    } catch (error) {
        setError(getErrorMessage(error) || "Something went wrong. Please try again.");
    } finally {
        setIsLoading(false);
    }
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
export async function updateUserProfile({ updateUser, formData, originalData, setError, setIsLoading }: {
    updateUser: (user: SanitizedUser) => void;
    formData: ProfileFormData;
    originalData: Partial<ProfileFormData>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    try {
        setIsLoading(true);

        const updatedFields: Partial<ProfileFormData> = {};

        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'links') {
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
            if (typeof value === 'string') {
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


export async function followUser({ id }: {
    id: Types.ObjectId,
}) {
    try {
        const res = (await apiInstance.patch(`/api/users/connection/${id}/follow`)).data;
        return res
    } catch (error) {
        throw (getErrorMessage(error) || "Something went wrong. Please try again.");
    }
}


export async function unfollowUser({ id }: {
    id: Types.ObjectId
}) {
    try {
        const res = (await apiInstance.patch(`/api/users/connection/${id}/unfollow`)).data;
        return res;
    } catch (error) {
        throw (getErrorMessage(error) || "Something went wrong. Please try again.");
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
export async function getUserProfileData({ username, setProfileData, setIsOwner, setError, cookie }: {
    username: string;
    setProfileData?: React.Dispatch<React.SetStateAction<SanitizedUser | null>>;
    setIsOwner?: React.Dispatch<React.SetStateAction<boolean>>;
    setError?: React.Dispatch<React.SetStateAction<string>>;
    cookie?: string;
}) {
    try {
        const headers = { "cookie": cookie ?? "" };
        const res = (await apiInstance.get(`/api/users/${username}`, { headers })).data;
        setProfileData?.(res.user);
        setIsOwner?.(res.isOwner);
        return res.user;
    } catch (error) {
        setError?.(getErrorMessage(error) || "Something went wrong. Please try again.");
        return null;
    }
}

/**
 * Fetches the list of users who are either followers or following the user with the given ID.
 * @param {{ id: Types.ObjectId, setUsers: React.Dispatch<React.SetStateAction<ShortUser[]>>, type: "followers" | "following", setError: React.Dispatch<React.SetStateAction<string | null>> }} props - The props to fetch the connection list.
 * @prop {Types.ObjectId} id - The ID of the user whose connection list is to be fetched.
 * @prop {React.Dispatch<React.SetStateAction<ShortUser[]>>} setUsers - The function to update the users state.
 * @prop {"followers" | "following"} type - The type of connection list to be fetched.
 * @prop {React.Dispatch<React.SetStateAction<string | null>>} setError - The function to update the error state.
 */
export async function getUserConnectionList({ id, type }: {
    id: Types.ObjectId,
    type: "followers" | "following",
}) {
    try {
        const res = (await apiInstance.get(`/api/users/connection/${id}/${type}`)).data;
        return res.users
    } catch (error) {
        throw (getErrorMessage(error) || "Something went wrong. Please try again.");
    }
}

/**
 * Updates the links of the currently logged in user.
 * @param {{ links: string[], setError?: React.Dispatch<React.SetStateAction<string | null>>, updateUser?: (user: SanitizedUser) => void }} props - The props to update the links.
 * @prop {string[]} links - The links to update.
 * @prop {React.Dispatch<React.SetStateAction<string | null>>} setError - The function to update the error state. Optional.
 * @prop {(user: SanitizedUser) => void} updateUser - The function to update the user state. Optional.
 */
export async function updateUserLinks({ links, setError, updateUser }: {
    links: string[],
    setError?: React.Dispatch<React.SetStateAction<string | null>>,
    updateUser?: (user: SanitizedUser) => void
}) {
    try {
        const res = (await apiInstance.put(`/api/users/update/links`, { links })).data;
        updateUser?.(res.user)
    } catch (error) {
        setError?.(getErrorMessage(error) || "Something went wrong. Please try again.");
    }
}

/**
 * Updates the cover picture of the currently logged in user.
 * @param {{ file: Blob, onDone: (data: any) => void, setError: React.Dispatch<React.SetStateAction<string | null>> }} props - The props to update the cover picture.
 * @prop {Blob} file - The file to update the cover picture with.
 * @prop {(data: any) => void} onDone - The function to call when the update is successful.
 * @prop {React.Dispatch<React.SetStateAction<string | null>>} setError - The function to call when there is an error.
 */
export async function updateUserCover({ file, onDone, setError }: {
    file: Blob,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDone: (data: any) => void
    setError: React.Dispatch<React.SetStateAction<string | null>>
}) {
    try {
        if (!file) throw new Error("No file provided");

        const formData = new FormData();
        formData.append("file", file);

        const response = await apiInstance.put(`/api/users/update/cover_pic`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        onDone(response.data);
    } catch (error) {
        setError(getErrorMessage(error) || "Something went wrong. Please try again.");
    }
}


export async function updateUserProfilePic({ file }: { file: Blob }) {
    try {
        if (!file) throw new Error("No file provided");

        const formData = new FormData();
        formData.append("file", file);

        const response = await apiInstance.put(`/api/users/update/profile_pic`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        return response.data;
    } catch (error) {
        throw (getErrorMessage(error) || "Something went wrong. Please try again.");
    }
}

/**
 * Updates the type of the currently logged in user.
 * @param {{ onDone: ((data: unknown) => void) | undefined, doFun: (() => void) | undefined, setError: React.Dispatch<React.SetStateAction<string | null>> }} props - The props to update the type.
 * @prop {((data: unknown) => void) | undefined} onDone - The function to call when the update is successful.
 * @prop {(() => void) | undefined} doFun - The function to call when the update is successful.
 * @prop {React.Dispatch<React.SetStateAction<string | null>>} setError - The function to call when there is an error.
 */
export async function updateType({ onDone, doFun, setError }: {
    onDone?: (data: unknown) => void
    doFun?: () => void;
    setError: Dispatch<SetStateAction<string | null>>;
}) {
    try {
        const res = (await apiInstance.patch(`/api/users/update/account/type`)).data;
        onDone?.(res);
        doFun?.();
    } catch (error) {
        setError(getErrorMessage(error))
    }
}


/**
 * Updates the status of the currently logged in user.
 * @param {{ onDone: ((data: unknown) => void) | undefined, doFun: (() => void) | undefined, setError: React.Dispatch<React.SetStateAction<string | null>> }} props - The props to update the status.
 * @prop {((data: unknown) => void) | undefined} onDone - The function to call when the update is successful.
 * @prop {(() => void) | undefined} doFun - The function to call when the update is successful.
 * @prop {React.Dispatch<React.SetStateAction<string | null>>} setError - The function to call when there is an error.
 */
export async function updateStatus({ onDone, doFun, setError }: {
    onDone?: (data: unknown) => void
    doFun?: () => void;
    setError: Dispatch<SetStateAction<string | null>>;
}) {
    try {
        const res = (await apiInstance.patch(`/api/users/update/account/online`)).data;
        onDone?.(res);
        doFun?.();
    } catch (error) {
        setError(getErrorMessage(error))
    }
}

/**
 * Fetches the mutual connections of the currently logged in user.
 * @param {string} searchKey - The search key to filter the mutual connections by.
 * @returns {Promise<SanitizedUser[]>} - The mutual connections of the currently logged in user.
 * @throws {Error} - If there is an error fetching the mutual connections.
 */
export async function fecthMutualConnections(searchKey: string) {
    try {
        const res = (await apiInstance.get(`/api/users/connection?searchKey=${searchKey}`)).data;
        return res.connection;
    } catch (error) {
        throw new Error(getErrorMessage(error))
    }
}

/**
 * Checks if a given username is available.
 * @param {string} username - The username to check for availability.
 * @returns {Promise<boolean>} - A promise that resolves to true if the username is available, false otherwise.
 */
export async function checkUsernameAvailability(username: string) {
    const res = await apiInstance.get(`/api/users/validate/username?username=${username}`);
    return res.data.available
}