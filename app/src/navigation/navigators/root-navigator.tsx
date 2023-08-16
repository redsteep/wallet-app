import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "~/features/onboarding/login-screen";
import { useSimpleAccount } from "~/lib/hooks/use-simple-account";
import {
  HomeNavigator,
  type HomeStackParamList,
} from "~/navigation/navigators/home-navigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Login: undefined;
  Home: HomeStackParamList;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export function RootNavigator() {
  const simpleAccount = useSimpleAccount();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        statusBarStyle: "dark",
      }}
    >
      {simpleAccount ? (
        <Stack.Screen name="Home" component={HomeNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
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
