import {
  type BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  type CompositeScreenProps,
  type NavigatorScreenParams,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { PanModalProvider } from "@wallet/pan-modal";
import type { Asset } from "~/features/assets/assets";
import { AssetsScreen } from "~/features/assets/screens/assets-screen";
import { TokenScreen } from "~/features/assets/screens/token-screen";
import { DappBrowserScreen } from "~/features/dapp-browser/browser-screen";
import { ReceiveScreen } from "~/features/receive-assets/receive-screen";
import { TransferScreen } from "~/features/transfer-assets/transfer-screen";

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Token: { asset: Asset };
  Receive: undefined;
  Transfer: undefined;
};

export type TabParamList = {
  Assets: undefined;
  Browser: undefined;
};

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<AppStackParamList>
>;

export function AppNavigator() {
  return (
    <PanModalProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />

        <Stack.Group
          screenOptions={{
            presentation: "transparentModal",
            animation: "none",
          }}
        >
          <Stack.Screen name="Token" component={TokenScreen} />
          <Stack.Screen name="Receive" component={ReceiveScreen} />
          <Stack.Screen name="Transfer" component={TransferScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </PanModalProvider>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Assets" component={AssetsScreen} />
      <Tab.Screen name="Browser" component={DappBrowserScreen} />
    </Tab.Navigator>
  );
}
