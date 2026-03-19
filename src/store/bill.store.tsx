import { create } from 'zustand'

interface billType {
    switcher: string;
    setSwitcher: (switcher: string) => void;
}

export const useBillStore = create<billType>((set) => ({
    switcher: "pro",
    setSwitcher: (switcher: string) => set({ switcher })}))