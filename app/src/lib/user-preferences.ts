import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { persistentZustandStorage } from "~/utils/persistent-zustand";

interface UserPreferencesState {
  hasHydrated: boolean;
  hasEnabledBiometrics: boolean;
  hasFinishedOnboarding: boolean;
  actions: {
    setHasHydrated: (value: boolean) => void;
    setEnabledBiometrics: (value: boolean) => void;
    setFinishedOnboarding: (value: boolean) => void;
    reset: () => void;
  };
}

export const useUserPreferences = create<UserPreferencesState>()(
  persist(
    (set) =>
      <UserPreferencesState>{
        hasHydrated: false,
        hasEnabledBiometrics: false,
        hasFinishedOnboarding: false,
        actions: {
          setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
          setEnabledBiometrics: (value: boolean) => set({ hasEnabledBiometrics: value }),
          setFinishedOnboarding: (value: boolean) =>
            set({ hasFinishedOnboarding: value }),

          reset: () => {
            set({
              hasEnabledBiometrics: false,
              hasFinishedOnboarding: false,
            });
          },
        },
      },
    {
      name: "user-preferences-state",
      version: 1.0,
      storage: createJSONStorage(() => persistentZustandStorage),
      onRehydrateStorage: () => (state) => state?.actions.setHasHydrated(true),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      partialize: ({ actions, ...rest }) => ({ ...rest }),
    },
  ),
);
