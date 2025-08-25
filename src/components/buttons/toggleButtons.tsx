import React, { FC } from "react";
import ConfirmationModal from "../modal/ConfirmationModal";
import { IUser } from "@/models/User";
import { updateStatus, updateType } from "@/services/api/user-apis";
import { SanitizedUser } from "@/utils/sanitizer/user";

type AccTypeTogglerProps = {
    setUser: React.Dispatch<React.SetStateAction<SanitizedUser | null>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>
    accountType?: IUser['accountType'];
}

export const AccTypeToggler: FC<AccTypeTogglerProps> = ({ accountType, setError, setUser }) => {
    const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    const switchType = async () => {
        setLoading(true);
        await updateType({
            setError: setError,
            doFun: () => {
                setUser(
                    (prev) => prev &&
                    {
                        ...prev,
                        accountType: accountType === "private" ? "public" : "private"
                    })
            }
        }).finally(() => {
            setLoading(false);
            setModalIsOpen(false);
        })
    };

    return (
        <React.Fragment>
            <button
                onClick={() => setModalIsOpen(true)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${accountType === "private" ? "bg-blue-600" : "bg-gray-400"}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${accountType === "private" ? "translate-x-6" : "translate-x-1"}`}
                />
            </button>
            <ConfirmationModal
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                onConfirm={switchType}
                cancelText="Cancel"
                confirmText="Switch"
                title="Switch Account Type"
                loading={loading}
                message={`Are you sure you want to switch to a ${accountType === "private" ? "public" : "private"} account?`}
            />
        </React.Fragment>
    )
}


type OnlStatusTogglerProps = {
    setUser: React.Dispatch<React.SetStateAction<SanitizedUser | null>>;
    onlineStatus?: boolean;
    setError: React.Dispatch<React.SetStateAction<string | null>>
}

export const OnlStatusToggler: FC<OnlStatusTogglerProps> = ({ onlineStatus, setUser, setError }) => {
    const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    const switchStatus = async () => {
        setLoading(true);
        await updateStatus({
            setError: setError,
            doFun: () => {
                setUser(
                    (prev) => prev &&
                    {
                        ...prev,
                        onlineStatus: !onlineStatus
                    })
            }
        }).finally(() => {
            setLoading(false);
            setModalIsOpen(false);
        })
    };

    return (
        <React.Fragment>
            <button
                onClick={() => setModalIsOpen(true)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
      ${onlineStatus ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-400 dark:bg-gray-600"}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
          ${onlineStatus ? "translate-x-6" : "translate-x-1"}`}
                />
            </button>

            <ConfirmationModal
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                onConfirm={switchStatus}
                cancelText="Cancel"
                confirmText="Switch"
                title="Switch Online Status"
                loading={loading}
                message={`Are you sure you want to ${onlineStatus ? "hide" : "show"} your online status?`}
            />
        </React.Fragment>
    )
}