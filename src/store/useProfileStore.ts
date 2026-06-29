import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfileSummary } from '@/types';

interface ProfileStoreState {
  selectedProfiles: UserProfileSummary[];
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (userId: string) => void;
  clearProfiles: () => void;
  reorderProfiles: (startIndex: number, endIndex: number) => void;
}

export const useProfileStore = create<ProfileStoreState>()(
  persist(
    (set) => ({
      selectedProfiles: [],
      addProfile: (profile) =>
        set((state) => {
          if (state.selectedProfiles.some((p) => p.user_id === profile.user_id)) {
            return state;
          }
          return { selectedProfiles: [...state.selectedProfiles, profile] };
        }),
      removeProfile: (userId) =>
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter(
            (p) => p.user_id !== userId
          ),
        })),
      clearProfiles: () => set({ selectedProfiles: [] }),
      reorderProfiles: (startIndex, endIndex) =>
        set((state) => {
          const result = [...state.selectedProfiles];
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { selectedProfiles: result };
        }),
    }),
    {
      name: 'wobb-selected-profiles',
    }
  )
);
