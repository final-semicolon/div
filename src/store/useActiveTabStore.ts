import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ActiveTabState = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const useActiveTabStore = create<ActiveTabState>()(
  persist(
    (set) => ({
      activeTab: 'posts',
      setActiveTab: (tab) => set({ activeTab: tab })
    }),
    {
      name: 'active-tab',
      getStorage: () => localStorage
    }
  )
);

export default useActiveTabStore;
