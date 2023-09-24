import { Ionicons } from "@expo/vector-icons";
import { type NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useUserPreferences } from "~/lib/user-preferences";
import {
  AppNavigator,
  type AppStackParamList,
} from "~/navigation/navigators/app-navigator";
import {
  OnboardingNavigator,
  type OnboardingStackParamList,
} from "~/navigation/navigators/onboarding-navigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export function RootNavigator() {
  const [fontsLoaded] = useFonts(Ionicons.font);

  const hasHydrated = useUserPreferences((state) => state.hasHydrated);
  const hasOnboarded = useUserPreferences((state) => state.hasFinishedOnboarding);

  useEffect(() => {
    if (hasHydrated && fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [hasHydrated, fontsLoaded]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasOnboarded ? (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingNavigator}
          options={{
            animationTypeForReplace: "pop", // state.isSignout ? "pop" : "push",
          }}
        />
      ) : (
        <Stack.Screen name="App" component={AppNavigator} />
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
