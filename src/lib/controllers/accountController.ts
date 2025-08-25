import User, { IUser } from "@/models/User";
import { connectDB } from "../db/mongoose";
import { NotFoundError } from "../errors/ApiErrors";

type Response = {
    status: boolean;
    message: string;
} | undefined;

/**
 * Switches the account type of a user.
 * @param user_id The ID of the user to switch the account type.
 * @returns {Promise<{
 *     status: boolean;
 *     message: string;
 * } | undefined>}
 * A promise that resolves to an object with status and message properties, or undefined if no user is found.
 * The status property is a boolean indicating if the operation was successful.
 * The message property is a string indicating the outcome of the operation.
 * If the user is found, the account type will be toggled between 'public' and 'private'.
 * If the user is not found, a NotFoundError is thrown.
 */
export async function switchAccountType(user_id: string): Promise<Response> {
    await connectDB();

    const user = await User.findById(user_id).lean<IUser>();

    if (!user) throw new NotFoundError('User not found');

    await User.findByIdAndUpdate(user_id, {
        $set: {
            accountType: user.accountType === 'public' ? 'private' : 'public'
        }
    });
    return {
        status: true,
        message: "Account type changed to private."
    }
}

/**
 * Switches the online status of a user.
 * @param user_id The ID of the user to switch the online status.
 * @returns {Promise<{
 *     status: boolean;
 *     message: string;
 * } | undefined>}
 * A promise that resolves to an object with status and message properties, or undefined if no user is found.
 * The status property is a boolean indicating if the operation was successful.
 * The message property is a string indicating the outcome of the operation.
 * If the user is found, the online status will be toggled between 'online' and 'offline'.
 * If the user is not found, a NotFoundError is thrown.
 */
export async function switchOnlineStatus(user_id: string): Promise<Response> {
    await connectDB();

    const user = await User.findById(user_id).lean<IUser>();

    if (!user) throw new NotFoundError('User not found');

    await User.findByIdAndUpdate(user_id, {
        $set: {
            onlineStatus: !user.onlineStatus
        }
    });
    return {
        status: true,
        message: "Online status changed."
    }
}

/**
 * Switches the message permission of a user.
 * @param user_id The ID of the user to switch the message permission.
 * @param messageFrom The new message permission.
 * @returns {Promise<{
 *     status: boolean;
 *     message: string;
 * } | undefined>}
 * A promise that resolves to an object with status and message properties, or undefined if no user is found.
 * The status property is a boolean indicating if the operation was successful.
 * The message property is a string indicating the outcome of the operation.
 * If the user is found, the message permission will be changed to the provided value.
 * If the user is not found, a NotFoundError is thrown.
 */
export async function switchMessagePermission(user_id: string, messageFrom: IUser['messageFrom']): Promise<Response> {
    await connectDB();

    const user = await User.findById(user_id).lean<IUser>();

    if (!user) throw new NotFoundError('User not found');

    await User.findByIdAndUpdate(user_id, {
        $set: {
            messageFrom: messageFrom
        }
    });

    return {
        status: true,
        message: "Message permission changed."
    }

}

