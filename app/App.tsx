import { StatusBar } from "expo-status-bar";
import { AppProvider } from "~/providers";
import { AppNavigation } from "~/navigation";

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="auto" />
      <AppNavigation />
    </AppProvider>
  );
}
