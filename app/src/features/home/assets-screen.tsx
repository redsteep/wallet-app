import { PanModal } from "@wallet/pan-modal";
import { Pressable } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { Header } from "~/features/home/components/header";
import { TokenRow } from "~/features/home/components/token-row";
import BottomSheet from "@gorhom/bottom-sheet";
import { useEffect, useMemo, useRef } from "react";
import { LoginScreen } from "~/features/onboarding/login-screen";
import { useAccount } from "wagmi";

export function AssetsScreen() {
  const { address } = useAccount();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // TODO: present conditionally after onboarding is updated
  useEffect(() => bottomSheetRef.current?.expand(), []);

  return (
    <PanModal.Offscreen disableScaling>
      <SafeAreaStack
        flexDirection="column"
        justifyContent="space-between"
        backgroundColor="$backgroundStrong"
        paddingHorizontal="$4"
      >
        <YStack flex={1}>
          <Header accountAddress={address} />

          <XStack space="$3">
            <Pressable>
              <Text fontSize="$5" fontWeight="600">
                Tokens
              </Text>
            </Pressable>

            <Pressable>
              <Text fontSize="$5" fontWeight="600" color="$gray10">
                Collectibles
              </Text>
            </Pressable>
          </XStack>

          <YStack paddingVertical="$4" space="$3">
            <TokenRow accountAddress={address} tokenName="Ethereum" />
          </YStack>
        </YStack>

        <XStack justifyContent="center" paddingVertical="$4" space="$2">
          <PanModal.Trigger
            destination={{ name: "Receive" }}
            style={{ borderRadius: 16, overflow: "hidden" }}
          >
            <YStack backgroundColor="black" paddingVertical="$3" paddingHorizontal="$4">
              <Text fontSize="$6" fontWeight="600" color="white">
                Receive
              </Text>
            </YStack>
          </PanModal.Trigger>

          <PanModal.Trigger
            destination={{ name: "Transfer" }}
            style={{ borderRadius: 16, overflow: "hidden" }}
          >
            <YStack backgroundColor="black" paddingVertical="$3" paddingHorizontal="$4">
              <Text fontSize="$6" fontWeight="600" color="white">
                Transfer
              </Text>
            </YStack>
          </PanModal.Trigger>
        </XStack>

        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
          <LoginScreen />
        </BottomSheet>
      </SafeAreaStack>
    </PanModal.Offscreen>
  );
}
