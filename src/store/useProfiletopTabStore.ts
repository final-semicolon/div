import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProfiletopTabState = {
  topButtonTab: string;
  settopButtonTab: (tab: string) => void;
};

const useProfiletopTabStore = create<ProfiletopTabState>()(
  persist(
    (set) => ({
      topButtonTab: 'profile',
      settopButtonTab: (tab) => set({ topButtonTab: tab })
    }),
    {
      name: 'Profile-tab',
      getStorage: () => localStorage
    }
  )
);

export default useProfiletopTabStore;
