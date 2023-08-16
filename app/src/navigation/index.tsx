import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "~/navigation/navigators/root-navigator";
import { linking } from "~/navigation/linking";

export function AppNavigation() {
  return (
    <NavigationContainer linking={linking}>
      <RootNavigator />
    </NavigationContainer>
  );
}
