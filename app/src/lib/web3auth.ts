import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";

import Web3Auth, { LOGIN_PROVIDER, OPENLOGIN_NETWORK } from "@web3auth/react-native-sdk";

import type { Hex } from "viem";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { WEB3AUTH_CLIENT_ID } from "~/lib/env-variables";
import { useUserPreferences } from "~/lib/user-preferences";
import { web3AuthRedirectUrl } from "~/navigation/linking";
import { persistentZustandStorage } from "~/utils/persistent-zustand";

const web3auth = new Web3Auth(WebBrowser, SecureStore, {
  clientId: WEB3AUTH_CLIENT_ID,
  network: OPENLOGIN_NETWORK.TESTNET,
});

web3auth.init();

interface Web3AuthState {
  hasHydrated: boolean;
  privateKey?: Hex;
  actions: {
    setHasHydrated: (hasHydrated: boolean) => void;
    loginWith: (providerKey: Hex) => Promise<void>;
    logout: () => Promise<void>;
  };
}

export const useWeb3Auth = create<Web3AuthState>()(
  persist(
    (set) =>
      <Web3AuthState>{
        hasHydrated: false,
        actions: {
          setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
          loginWith: async (providerKey: string) => {
            try {
              await web3auth.login({
                loginProvider: LOGIN_PROVIDER[providerKey as never],
                redirectUrl: web3AuthRedirectUrl,
              });
            } catch (error) {
              console.warn(error);
            }

            if (web3auth.privKey) {
              set({ privateKey: `0x${web3auth.privKey}` });
            }
          },
          logout: async () => {
            try {
              await web3auth.logout();
            } catch (error) {
              console.warn(error);
            } finally {
              useUserPreferences.getState().actions.reset();
              set({ privateKey: undefined });
            }
          },
        },
      },
    {
      name: "web3auth-state",
      version: 1.0,
      storage: createJSONStorage(() => persistentZustandStorage),
      onRehydrateStorage: () => (state) => state?.actions.setHasHydrated(true),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      partialize: ({ actions, ...rest }) => ({ ...rest }),
    },
  ),
);
