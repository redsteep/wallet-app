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
import { PanModal, PanModalProvider } from "@wallet/pan-modal";
import { useTheme } from "tamagui";
import { type Address } from "viem";
import { TabHeader } from "~/components/tab-header";
import { ActivityScreen } from "~/features/activity/activity-screen";
import type { Asset } from "~/features/assets";
import { AssetsScreen } from "~/features/assets/assets-screen";
import { BrowserScreen } from "~/features/browser/browser-screen";
import { ReceiveScreen } from "~/features/receive/receive-screen";
import { TokenScreen } from "~/features/token/token-screen";
import { TransferScreen } from "~/features/transfer/transfer-screen";

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();

export type TabParamList = {
  Activity: undefined;
  Assets: undefined;
  Browser: undefined;
};

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Token: { token: Asset };
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
    <PanModal.Offscreen>
      <Tab.Navigator
        initialRouteName="Assets"
        screenOptions={{
          // FYI: https://reactnavigation.org/docs/7.x/bottom-tab-navigator#specify-a-height-in-headerstyle
          header: () => <TabHeader />,
          transitionSpec: {
            animation: "spring",
            config: {
              mass: 0.5,
              damping: 8,
              stiffness: 100,
              overshootClamping: true,
            },
          },
          sceneStyleInterpolator: ({ current }) => ({
            sceneStyle: {
              backgroundColor: theme.backgroundStrong.get(),
              opacity: current.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [0, 1, 0],
              }),
              transform: [
                {
                  translateX: current.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [-50, 1, 50],
                  }),
                },
              ],
            },
          }),
          tabBarActiveTintColor: theme.color.get(),
          tabBarInactiveTintColor: theme.color8.get(),
          tabBarLabel: () => null,
        }}
      >
        <Tab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "time" : "time-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
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
            headerShown: false,
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
    </PanModal.Offscreen>
  );
}
