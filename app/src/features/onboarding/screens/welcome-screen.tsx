import { Text, Theme, YStack } from "tamagui";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { LoginButton } from "~/features/onboarding/components/login-button";

export function WelcomeScreen() {
  return (
    <SafeAreaStack
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="$backgroundStrong"
      padding="$4"
    >
      <YStack flex={1} justifyContent="center" alignItems="center" space="$4">
        <Text fontSize="$10" fontWeight="700">
          Redsteep Wallet
        </Text>
      </YStack>

      <YStack space="$3">
        <Theme name="blue">
          <LoginButton
            providerKey="google"
            providerName="Google"
            providerIcon="logo-google"
          />
        </Theme>

        <Theme name="dark">
          <LoginButton
            providerKey="apple"
            providerName="Apple ID"
            providerIcon="logo-apple"
          />
        </Theme>
      </YStack>
    </SafeAreaStack>
  );
}
