import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import Web3Auth, { LOGIN_PROVIDER, OPENLOGIN_NETWORK } from "@web3auth/react-native-sdk";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { persistentZustandStorage } from "~/utils/persistent-zustand";
import { WEB3AUTH_CLIENT_ID } from "~/lib/env-variables";

const web3auth = new Web3Auth(WebBrowser, {
  clientId: WEB3AUTH_CLIENT_ID,
  network: OPENLOGIN_NETWORK.TESTNET,
});

interface Web3AuthState {
  userInfo?: unknown;
  privateKey?: string;
  actions: {
    loginWith: (providerKey: string) => Promise<void>;
    logout: () => Promise<void>;
  };
}

export const useWeb3Auth = create<Web3AuthState>()(
  persist(
    (set) =>
      <Web3AuthState>{
        actions: {
          async loginWith(providerKey: string) {
            try {
              const loginResult = await web3auth.login({
                loginProvider: LOGIN_PROVIDER[providerKey as never],
                redirectUrl: Linking.createURL("onboarding"),
              });

              set({
                privateKey: loginResult.privKey,
                userInfo: loginResult.userInfo,
              });
            } catch (error) {
              console.warn(error);
            }
          },
          async logout() {
            try {
              await web3auth.logout({
                redirectUrl: Linking.createURL("onboarding"),
              });
            } catch (error) {
              console.warn(error);
            } finally {
              set({ privateKey: undefined });
            }
          },
        },
      },
    {
      name: "web3auth-state",
      version: 1.0,
      storage: createJSONStorage(() => persistentZustandStorage),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      partialize: ({ actions, ...rest }) => ({ ...rest }),
    },
  ),
);
