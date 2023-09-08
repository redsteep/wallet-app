import Ionicons from "@expo/vector-icons/Ionicons";
import {
  createBottomTabNavigator,
  type BottomTabScreenProps,
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
import { useTheme } from "tamagui";
import { type Address } from "viem";
import type { Asset } from "~/features/assets/assets";
import { AssetsScreen } from "~/features/assets/screens/assets-screen";
import { TokenScreen } from "~/features/assets/screens/token-screen";
import { BrowserScreen } from "~/features/browser/browser-screen";
import { ReceiveScreen } from "~/features/receive-assets/receive-screen";
import { TransferScreen } from "~/features/transfer-assets/transfer-screen";

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();

export type TabParamList = {
  Assets: undefined;
  Browser: undefined;
};

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Token: { asset: Asset };
  Receive: undefined;
  Transfer?: { recipientAddress?: Address; asset?: Asset; value?: bigint };
};

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<AppStackParamList>
>;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

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
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.color.get(),
        tabBarInactiveTintColor: theme.color8.get(),
        tabBarLabel: () => null,
      }}
    >
      <Tab.Screen
        name="Assets"
        component={AssetsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Browser"
        component={BrowserScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "compass" : "compass-outline"}
              color={color}
              size={28}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
