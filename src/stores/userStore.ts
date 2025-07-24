import { IUser } from "@/models/User";
import { create } from "zustand";

interface UserStore {
    user: IUser | null;
    setUser: (user: IUser) => void;
    updateUser: (updates: Partial<IUser>) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
    })),
    clearUser: () => set({ user: null })
}))