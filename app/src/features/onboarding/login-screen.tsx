import { LoginButton } from "~/features/onboarding/components/login-button";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { Theme } from "tamagui";

export function LoginScreen() {
  return (
    <SafeAreaStack
      alignItems="center"
      justifyContent="center"
      backgroundColor="$background"
      space="$2"
    >
      <Theme name="blue">
        <LoginButton providerKey="google" />
      </Theme>

      <LoginButton providerKey="apple" />
    </SafeAreaStack>
  );
}
