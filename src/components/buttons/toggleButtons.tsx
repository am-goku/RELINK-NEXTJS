import React, { FC } from "react";
import ConfirmationModal from "../modal/ConfirmationModal";

type AccTypeTogglerProps = {
    setPvtAccount: React.Dispatch<React.SetStateAction<boolean>>;
    pvtAccount: boolean;
}

export const AccTypeToggler: FC<AccTypeTogglerProps> = ({ pvtAccount, setPvtAccount }) => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const switchType = () => {
        setPvtAccount(!pvtAccount)
        setModalIsOpen(false)
        console.log('switching to private');
    };

    return (
        <React.Fragment>
            <button
                onClick={() => setModalIsOpen(true)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${pvtAccount ? "bg-blue-600" : "bg-gray-400"}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${pvtAccount ? "translate-x-6" : "translate-x-1"}`}
                />
            </button>
            <ConfirmationModal
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                onConfirm={switchType}
                cancelText="Cancel"
                confirmText="Switch"
                title="Switch Account Type"
                message={`Are you sure you want to switch to a ${pvtAccount ? "public" : "private"} account?`}
            />
        </React.Fragment>
    )
}


type OnlStatusTogglerProps = {
    setOnlStatus: React.Dispatch<React.SetStateAction<boolean>>;
    onlStatus: boolean;
}

export const OnlStatusToggler: FC<OnlStatusTogglerProps> = ({ onlStatus, setOnlStatus }) => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const switchStatus = () => {
        setOnlStatus(!onlStatus)
        setModalIsOpen(false)
        console.log('switching to private');
    };

    return (
        <React.Fragment>
            <button
                onClick={() => setModalIsOpen(true)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
      ${onlStatus ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-400 dark:bg-gray-600"}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
          ${onlStatus ? "translate-x-6" : "translate-x-1"}`}
                />
            </button>

            <ConfirmationModal
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                onConfirm={switchStatus}
                cancelText="Cancel"
                confirmText="Switch"
                title="Switch Online Status"
                message={`Are you sure you want to ${onlStatus ? "hide" : "show"} your online status?`}
            />
        </React.Fragment>
    )
}