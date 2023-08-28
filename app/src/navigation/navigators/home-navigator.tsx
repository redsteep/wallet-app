import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PanModalProvider } from "@wallet/pan-modal";
import { AssetsScreen } from "~/features/assets/assets-screen";
import { ReceiveScreen } from "~/features/receive-assets/receive-screen";
import { TransferScreen } from "~/features/transfer-assets/transfer-screen";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export type HomeStackParamList = {
  Assets: undefined;
  Receive: undefined;
  Transfer: undefined;
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

export function HomeNavigator() {
  return (
    <PanModalProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Assets" component={AssetsScreen} />
        <Stack.Group
          screenOptions={{
            animation: "none",
            presentation: "transparentModal",
          }}
        >
          <Stack.Screen name="Receive" component={ReceiveScreen} />
          <Stack.Screen name="Transfer" component={TransferScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </PanModalProvider>
  );
}
