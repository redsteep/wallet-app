import { Platform } from "react-native";

export const isExtension =
  Platform.OS === "web" && typeof window.chrome?.runtime !== "undefined";
