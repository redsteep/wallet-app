import { LoginButton } from "~/features/onboarding/components/login-button";
import { Theme, YStack } from "tamagui";

export function LoginScreen() {
  return (
    <YStack flex={1} backgroundColor="$gray5">
      <Theme name="blue">
        <LoginButton providerKey="google" />
      </Theme>

      <LoginButton providerKey="apple" />
    </YStack>
  );
}
