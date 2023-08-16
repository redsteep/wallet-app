import { AppProvider } from "~/providers";
import { AppNavigation } from "~/navigation";

export default function App() {
  return (
    <AppProvider>
      <AppNavigation />
    </AppProvider>
  );
}
