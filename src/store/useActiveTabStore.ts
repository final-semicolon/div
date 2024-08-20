import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type ActiveTabState = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const useActiveTabStore = create<ActiveTabState>()(
  devtools(
    persist(
      (set) => ({
        activeTab: 'posts',
        setActiveTab: (tab) => set({ activeTab: tab })
      }),
      {
        name: 'active-tab'
      }
    )
  )
);

export default useActiveTabStore;
