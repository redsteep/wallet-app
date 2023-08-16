import { Platform } from "react-native";
import { Buffer } from "@craftzdog/react-native-buffer";

global.Buffer = Buffer as never;

if (Platform.OS !== "web") {
  require("expo-standard-web-crypto").polyfillWebCrypto();
  require("react-native-url-polyfill").setupURLPolyfill();
  require("react-native-quick-base64").shim();
}
