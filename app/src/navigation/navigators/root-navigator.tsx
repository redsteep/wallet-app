import { type NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useUserPreferences } from "~/lib/user-preferences";
import {
  HomeNavigator,
  type HomeStackParamList,
} from "~/navigation/navigators/home-navigator";
import {
  OnboardingNavigator,
  type OnboardingStackParamList,
} from "~/navigation/navigators/onboarding-navigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Home: NavigatorScreenParams<HomeStackParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export function RootNavigator() {
  const hasHydrated = useUserPreferences((state) => state.hasHydrated);
  const hasFinishedOnboarding = useUserPreferences(
    (state) => state.hasFinishedOnboarding,
  );

  useEffect(() => {
    hasHydrated && SplashScreen.hideAsync().catch(() => {});
  }, [hasHydrated]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasFinishedOnboarding ? (
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
