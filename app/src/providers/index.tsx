import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";
import { Stack, TamaguiProvider, Theme } from "tamagui";
import { Wrap } from "~/components/conditional-wrap";
import { isExtension } from "~/lib/platform-constants";
import { EthersRpcProvider } from "~/providers/ethers-rpc-provider";

import config from "tamagui.config";

export function AppProvider({ children }: React.PropsWithChildren) {
  const queryClient = useMemo(() => new QueryClient(), []);

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
          <EthersRpcProvider>
            <TamaguiProvider config={config}>
              <Theme name="light">{wrappedChildren}</Theme>
            </TamaguiProvider>
          </EthersRpcProvider>
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
