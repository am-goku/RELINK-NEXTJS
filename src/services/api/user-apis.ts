import apiInstance from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors/errorResponse";
import { SanitizedUser, ShortUser } from "@/utils/sanitizer/user";
import { Types } from "mongoose";
import React, { Dispatch, SetStateAction } from "react";

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
export async function getProfileData({ setFormData, setError, setOriginalData, setIsLoading }: get_profile_Props) {
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


type update_profile_Props = {
    updateUser: (user: SanitizedUser) => void;
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

/**
 * Follows the user with the provided username.
 * @param {{ username: string, setResponse: React.Dispatch<React.SetStateAction<{ action: string, success: boolean }>>, setError: React.Dispatch<React.SetStateAction<string>> }} props - The props to follow the user.
 * @prop {string} username - The username of the user to follow.
 * @prop {React.Dispatch<React.SetStateAction<{ action: string, success: boolean }>>} setResponse - The function to update the response state.
 * @prop {React.Dispatch<React.SetStateAction<string>>} setError - The function to update the error state.
 */
export async function followUser({ id, setResponse, setFollowers, setError, updateConn, setConnection }: {
    id: Types.ObjectId,
    setResponse?: React.Dispatch<React.SetStateAction<{ action: string, success: boolean }>>,
    setFollowers: React.Dispatch<React.SetStateAction<number>>,
    setError: React.Dispatch<React.SetStateAction<string>>;
    setConnection: React.Dispatch<React.SetStateAction<boolean>>;
    updateConn?: ({ setFollowers, setConnection, type }:
        {
            setFollowers: React.Dispatch<React.SetStateAction<number>>;
            type: "add" | "remove";
            setConnection: React.Dispatch<React.SetStateAction<boolean>>
        }) => void
}) {
    try {
        const res = (await apiInstance.patch(`/api/users/connection/${id}/follow`)).data;
        setResponse?.(res);
    } catch (error) {
        console.log(id, error)
        updateConn?.({ setFollowers, type: "remove", setConnection }); // now sets false explicitly
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
export async function unfollowUser({ id, setResponse, setFollowers, setError, setConnection, updateConn }: {
    id: Types.ObjectId,
    setResponse?: React.Dispatch<React.SetStateAction<{ action: string, success: boolean }>>,
    setFollowers: React.Dispatch<React.SetStateAction<number>>,
    setError: React.Dispatch<React.SetStateAction<string>>;
    setConnection: React.Dispatch<React.SetStateAction<boolean>>;
    updateConn?: ({ setFollowers, setConnection, type }:
        {
            setFollowers: React.Dispatch<React.SetStateAction<number>>;
            type: "add" | "remove";
            setConnection: React.Dispatch<React.SetStateAction<boolean>>
        }) => void
}) {
    try {
        const res = (await apiInstance.patch(`/api/users/connection/${id}/unfollow`)).data;
        setResponse?.(res);
    } catch (error) {
        console.log(error)
        updateConn?.({ setFollowers: setFollowers, type: "add", setConnection: setConnection });
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
        console.log("Response::::", res)
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
export async function getUserConnectionList({ id, setUsers, type, setError, setLoading }: {
    id: Types.ObjectId,
    setUsers: React.Dispatch<React.SetStateAction<ShortUser[]>>,
    type: "followers" | "following",
    setError?: React.Dispatch<React.SetStateAction<string | null>>,
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>
}) {
    try {
        setLoading?.(true);
        const res = (await apiInstance.get(`/api/users/connection/${id}/${type}`)).data;
        setUsers(res.users);
        console.log(res)
    } catch (error) {
        setError?.(getErrorMessage(error) || "Something went wrong. Please try again.");
    } finally {
        setLoading?.(false);
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
        console.log(error)
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

/**
 * Updates the profile picture of the currently logged in user.
 * @param {{ file: Blob, onDone: (data: any) => void, setError: React.Dispatch<React.SetStateAction<string | null>> }} props - The props to update the profile picture.
 * @prop {Blob} file - The file to update the profile picture with.
 * @prop {(data: any) => void} onDone - The function to call when the update is successful.
 * @prop {React.Dispatch<React.SetStateAction<string | null>>} setError - The function to call when there is an error.
 */
export async function updateUserProfilePic({ file, onDone, setError }: {
    file: Blob,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDone: (data: any) => void
    setError: React.Dispatch<React.SetStateAction<string | null>>
}) {
    try {
        if (!file) throw new Error("No file provided");

        const formData = new FormData();
        formData.append("file", file);

        const response = await apiInstance.put(`/api/users/update/profile_pic`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        onDone(response.data);
    } catch (error) {
        setError(getErrorMessage(error) || "Something went wrong. Please try again.");
    }
}

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