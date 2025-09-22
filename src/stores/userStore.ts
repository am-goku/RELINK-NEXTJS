'use client';

import { create } from 'zustand';
import { SanitizedUser } from '@/utils/sanitizer/user'; // adjust path
import { IUser } from '@/models/User';

type UserRole = IUser['role'];
type AnySanitizedUser = SanitizedUser<UserRole>;

type UserState = {
    user: AnySanitizedUser | null;
    setUser: (user: AnySanitizedUser | null) => void;
    updateUser: <K extends keyof AnySanitizedUser>(
        key: K,
        value: AnySanitizedUser[K]
    ) => void;
    updateMany: (updates: Partial<AnySanitizedUser>) => void;
    resetUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
    user: null,

    // Replace the whole user
    setUser: (user) => set({ user }),

    // Update single field
    updateUser: (key, value) =>
        set((state) =>
            state.user
                ? { user: { ...state.user, [key]: value } }
                : state
        ),

    // Update multiple fields at once
    updateMany: (updates) =>
        set((state) =>
            state.user
                ? { user: { ...state.user, ...updates } }
                : state
        ),

    // Reset back to null
    resetUser: () => set({ user: null }),
}));
