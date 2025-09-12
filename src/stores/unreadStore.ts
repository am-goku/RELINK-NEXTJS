import { create } from "zustand";

type UnreadState = {
  map: Record<string, number>; // convId -> count
  setUnread: (convId: string, count: number) => void;
  increment: (convId: string) => void;
  reduce: (convId: string) => void;
  clear: (convId: string) => void;
  clearState: () => void;
  total: () => number;
};

export const useUnreadStore = create<UnreadState>((set, get) => ({
  map: {},

  setUnread: (convId, count) =>
    set((state) => ({ map: { ...state.map, [convId]: count } })),

  increment: (convId) =>
    set((state) => ({
      map: { ...state.map, [convId]: (state.map[convId] || 0) + 1 },
    })),

  reduce: (convId) =>
    set((state) => ({
      map: { ...state.map, [convId]: (state.map[convId] || 0) - 1 },
    })),

  clear: (convId) =>
    set((state) => {
      const updated = { ...state.map };
      updated[convId] = 0;
      return { map: updated };
    }),

  clearState: () => set(() => ({ map: {} })),

  total: () => {
    return Object.values(get().map).reduce((a, b) => a + b, 0);
  },
}));
