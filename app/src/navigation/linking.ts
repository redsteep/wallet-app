import type { LinkingOptions } from "@react-navigation/native";
import type { RootStackParamList } from "~/navigation/navigators/root-navigator";

import * as Linking from "expo-linking";

const w3aAuthRedirectPath = "w3a_redirect";

export const web3AuthRedirectUrl = Linking.createURL(w3aAuthRedirectPath);

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Onboarding: {
        screens: {
          Setup: w3aAuthRedirectPath,
        },
      },
      App: {
        screens: {
          Transfer: "transfer",
        },
      },
    },
  },
  async getInitialURL() {
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();
    if (url != null) {
      return url;
    }
  },
};
