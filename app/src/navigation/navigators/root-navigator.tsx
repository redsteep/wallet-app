import { type NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useWeb3Auth } from "~/lib/web3auth";
import {
  HomeNavigator,
  type HomeStackParamList,
} from "~/navigation/navigators/home-navigator";
import { OnboardingNavigator } from "~/navigation/navigators/onboarding-navigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Onboarding: undefined;
  Home: NavigatorScreenParams<HomeStackParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export function RootNavigator() {
  const hasHydrated = useWeb3Auth((state) => state.hasHydrated);
  const isSignedIn = useWeb3Auth((state) => typeof state.privateKey !== "undefined");

  useEffect(() => {
    hasHydrated && SplashScreen.hideAsync().catch(() => {});
  }, [hasHydrated]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isSignedIn ? (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingNavigator}
          options={{
            animationTypeForReplace: "pop", // state.isSignout ? "pop" : "push",
          }}
        />
      ) : (
        <Stack.Screen name="Home" component={HomeNavigator} />
      )}
    </Stack.Navigator>
  );
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
