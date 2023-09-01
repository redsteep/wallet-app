import { Image } from "expo-image";
import {
  AuthenticationType,
  authenticateAsync,
  supportedAuthenticationTypesAsync,
} from "expo-local-authentication";
import { Platform, useWindowDimensions } from "react-native";
import { useQuery } from "react-query";
import { Button, Stack, Text, Theme, YStack } from "tamagui";
import { match } from "ts-pattern";
import { useUserPreferences } from "~/lib/user-preferences";

export function EnableBiometricsFlow({ goNext }: { goNext: () => void }) {
  const { width } = useWindowDimensions();
  const { setEnabledBiometrics } = useUserPreferences((state) => state.actions);

  const { data: supportedAuthTypes } = useQuery(
    "auth-types",
    supportedAuthenticationTypesAsync,
  );

  if (!supportedAuthTypes || supportedAuthTypes.length <= 0) {
    return null;
  }

  const biometricProductNames = supportedAuthTypes?.map((type) =>
    match([Platform.OS, type])
      .with(["ios", AuthenticationType.FINGERPRINT], () => "Touch ID")
      .with(["ios", AuthenticationType.FACIAL_RECOGNITION], () => "Face ID")
      .with(["android", AuthenticationType.FINGERPRINT], () => "Fingerprint")
      .with(["android", AuthenticationType.FACIAL_RECOGNITION], () => "Face Recognition")
      .otherwise(() => ""),
  );

  const enableBiometrics = async () => {
    const { success } = await authenticateAsync({ disableDeviceFallback: true });
    if (success) {
      setEnabledBiometrics(true);
      goNext();
    }
  };

  return (
    <Stack flex={1} justifyContent="space-between" space="$4">
      <YStack space="$3">
        <Text fontSize="$8" fontWeight="700">
          Enable Biometric Authentication
        </Text>
        <Text color="$color10" fontSize="$6" fontWeight="500">
          Use {biometricProductNames?.join(" or ")} to securely access your wallet.
        </Text>
      </YStack>

      <Stack justifyContent="center" alignItems="center">
        <Image
          source={require("assets/face-id.png")}
          style={{ width: width * 0.4, height: width * 0.4 }}
          transition={{ effect: "cross-dissolve", duration: 250 }}
        />
      </Stack>

      <YStack space="$3">
        <Button size="$5" onPress={goNext} chromeless>
          <Button.Text fontSize="$6" fontWeight="600">
            Remind Later
          </Button.Text>
        </Button>

        <Theme name="dark">
          <Button size="$5" onPress={enableBiometrics}>
            <Button.Text fontSize="$6" fontWeight="600">
              Use {biometricProductNames} Now
            </Button.Text>
          </Button>
        </Theme>
      </YStack>
    </Stack>
  );
}
