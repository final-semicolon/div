import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type ProfiletopTabState = {
  topButtonTab: string;
  setTopButtonTab: (tab: string) => void;
};

const useProfiletopTabStore = create<ProfiletopTabState>()(
  devtools(
    persist(
      (set) => ({
        topButtonTab: 'profile',
        setTopButtonTab: (tab) => set({ topButtonTab: tab })
      }),
      {
        name: 'Profile-tab'
      }
    )
  )
);

export default useProfiletopTabStore;
