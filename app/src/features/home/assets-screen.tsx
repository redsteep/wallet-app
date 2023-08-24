import BottomSheet from "@gorhom/bottom-sheet";
import { PanModal } from "@wallet/pan-modal";
import { useMemo, useRef } from "react";
import { Pressable } from "react-native";
import { ScrollView, Text, XStack, YStack } from "tamagui";
import { useAccount } from "wagmi";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { Header } from "~/features/home/components/header";
import { LeadingButtonRow } from "~/features/home/components/leading-button-row";
import { TokenRow } from "~/features/home/components/token-row";
import { LoginScreen } from "~/features/onboarding/login-screen";

export function AssetsScreen() {
  const { address } = useAccount();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  return (
    <PanModal.Offscreen>
      <SafeAreaStack
        flexDirection="column"
        justifyContent="space-between"
        backgroundColor="$backgroundStrong"
        padding="$3"
        space="$2"
      >
        <Header />

        {/* <XStack space="$3">
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
        </XStack> */}

        <ScrollView marginTop="$2">
          <YStack space="$4">
            <TokenRow tokenName="Ethereum" />
            <TokenRow
              tokenName="Stackup Token"
              token="0x3870419Ba2BBf0127060bCB37f69A1b1C090992B"
            />
          </YStack>
        </ScrollView>

        <LeadingButtonRow />
      </SafeAreaStack>

      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} enablePanDownToClose>
        <LoginScreen />
      </BottomSheet>
    </PanModal.Offscreen>
  );
}
