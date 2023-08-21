import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";
import { Stack, TamaguiProvider, Theme } from "tamagui";
import { Wrap } from "~/components/conditional-wrap";
import { isExtension } from "~/lib/platform-constants";
import { WagmiProvider } from "~/providers/wagmi-provider";

import config from "tamagui.config";

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
    <GestureHandlerRootView style={styles.gestureHandlerContainer}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <QueryClientProvider client={queryClient}>
          <TamaguiProvider config={config}>
            <WagmiProvider>
              <Theme name="light">{wrappedChildren}</Theme>
            </WagmiProvider>
          </TamaguiProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureHandlerContainer: {
    flex: 1,
  },
});
