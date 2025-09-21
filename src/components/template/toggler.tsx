'use client';

import React, { FC, useState } from "react";
import ConfirmationModal from "../modal/ConfirmationModal";

type ConfirmTogglerProps = {
    value: boolean; // current state (on/off)
    onConfirm: () => Promise<void>; // async action to execute when confirmed
    title: string; // modal title
    confirmText?: string;
    cancelText?: string;
    messageBuilder: (value: boolean) => string; // dynamic message depending on state
    activeColor?: string; // tailwind bg class for ON
    inactiveColor?: string; // tailwind bg class for OFF
};

export const ConfirmToggler: FC<ConfirmTogglerProps> = ({
    value,
    onConfirm,
    title,
    confirmText = "Switch",
    cancelText = "Cancel",
    messageBuilder,
    activeColor = "bg-blue-600 dark:bg-blue-500",
    inactiveColor = "bg-gray-400 dark:bg-gray-600",
}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
            setModalIsOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setModalIsOpen(true)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${value ? activeColor : inactiveColor}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${value ? "translate-x-6" : "translate-x-1"}`}
                />
            </button>

            <ConfirmationModal
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                onConfirm={handleConfirm}
                cancelText={cancelText}
                confirmText={confirmText}
                title={title}
                loading={loading}
                message={messageBuilder(value)}
            />
        </>
    );
};
