import type { LinkingOptions } from "@react-navigation/native";
import type { RootStackParamList } from "~/navigation/navigators/root-navigator";

import * as Linking from "expo-linking";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
};
