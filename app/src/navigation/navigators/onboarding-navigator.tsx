import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SetupScreen } from "~/features/onboarding/screens/setup-screen";
import { WelcomeScreen } from "~/features/onboarding/screens/welcome-screen";
import { useWeb3Auth } from "~/lib/web3auth";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export type OnboardingStackParamList = {
  Welcome: undefined;
  Setup: undefined;
};

export type OnboardingStackScreenProps<T extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, T>;

export function OnboardingNavigator() {
  const hasPrivateKey = useWeb3Auth((state) => typeof state.privateKey !== "undefined");

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
      {hasPrivateKey ? (
        <Stack.Screen name="Setup" component={SetupScreen} />
      ) : (
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      )}
    </Stack.Navigator>
  );
}
