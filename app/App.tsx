import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { AppProvider } from "~/providers";
import { AppNavigation } from "~/navigation";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="auto" />
      <AppNavigation />
    </AppProvider>
  );
}
