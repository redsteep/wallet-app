import { Theme } from "tamagui";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { LoginButton } from "~/features/onboarding/components/login-button";

export function WelcomeScreen() {
  return (
    <SafeAreaStack backgroundColor="$backgroundStrong">
      <Theme name="blue">
        <LoginButton providerKey="google" />
      </Theme>

      <LoginButton providerKey="apple" />
    </SafeAreaStack>
  );
}
