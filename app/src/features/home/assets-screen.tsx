import BottomSheet from "@gorhom/bottom-sheet";
import { PanModal } from "@wallet/pan-modal";
import { useMemo, useRef } from "react";
import { Pressable, TouchableOpacity } from "react-native";
import { Grid, ScrollView, Stack, Text, XStack, YStack } from "tamagui";
import { useAccount } from "wagmi";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { LeadingButtonRow } from "~/features/home/components/leading-button-row";
import { TokenRow } from "~/features/home/components/token-row";
import { LoginScreen } from "~/features/onboarding/login-screen";
import { useWeb3Auth } from "~/lib/web3auth";
import { shortenAddress } from "~/utils/shorten-address";

export function AssetsScreen() {
  const { address } = useAccount();
  const { logout } = useWeb3Auth((state) => state.actions);

  const formattedAddress = address ? shortenAddress(address) : "Loading...";

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  return (
    <PanModal.Offscreen>
      <SafeAreaStack
        flexDirection="column"
        justifyContent="space-between"
        backgroundColor="$backgroundStrong"
        padding="$4"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <YStack space="$2">
            <Text color="$color10" fontSize="$6" letterSpacing={0.25}>
              {formattedAddress}
            </Text>
            <Text fontSize="$10" fontWeight="700" letterSpacing={0.5} lineHeight={36.0}>
              $0.00
            </Text>
          </YStack>

          <TouchableOpacity onPress={logout}>
            <Text fontWeight="500">Logout</Text>
          </TouchableOpacity>
        </XStack>

        <ScrollView>
          <YStack paddingVertical="$4" space="$4">
            <Pressable>
              <Text fontSize="$6" fontWeight="600">
                Tokens
              </Text>
            </Pressable>

            <TokenRow tokenName="Ethereum" />
            <TokenRow
              tokenName="Stackup Token"
              token="0x3870419Ba2BBf0127060bCB37f69A1b1C090992B"
            />
          </YStack>
        </ScrollView>

        <LeadingButtonRow />
      </SafeAreaStack>

      <Grid columns={3}>
        <Stack backgroundColor="$color10" />
        <Stack backgroundColor="$color10" />
        <Stack backgroundColor="$color10" />
      </Grid>

      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} enablePanDownToClose>
        <LoginScreen />
      </BottomSheet>
    </PanModal.Offscreen>
  );
}
