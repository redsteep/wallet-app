import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";
import { Stack, TamaguiProvider, Theme } from "tamagui";
import { default as tamaguiConfig } from "tamagui.config";
import { Wrap } from "~/components/conditional-wrap";
import { isExtension } from "~/lib/platform-constants";
import { WagmiProvider } from "~/providers/wagmi-provider";
import { ToastProvider } from "@tamagui/toast";

const queryClient = new QueryClient();

export function AppProvider({ children }: React.PropsWithChildren) {
  const wrappedChildren = (
    <Wrap
      if={isExtension}
      with={(children) => <Stack width={350} height={550} children={children} />}
      children={children}
    />
  );

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <ToastProvider native={Platform.OS !== "web"}>
        <GestureHandlerRootView style={styles.gestureHandlerContainer}>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <QueryClientProvider client={queryClient}>
              <WagmiProvider>
                <Theme name="light">{wrappedChildren}</Theme>
              </WagmiProvider>
            </QueryClientProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ToastProvider>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  gestureHandlerContainer: {
    flex: 1,
  },
});
