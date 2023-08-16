import { PanModal } from "@wallet/pan-modal";
import { ZeroAddress } from "ethers";
import { Pressable } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { Header } from "~/features/home/components/header";
import { TokenRow } from "~/features/home/components/token-row";
import { useSimpleAccount } from "~/lib/hooks/use-simple-account";

export function AssetsScreen() {
  const simpleAccount = useSimpleAccount();
  const accountAddress = simpleAccount?.getSender() ?? ZeroAddress;

  console.debug(accountAddress);

  return (
    <PanModal.Offscreen disableScaling>
      <SafeAreaStack
        flexDirection="column"
        justifyContent="space-between"
        backgroundColor="white"
        paddingHorizontal="$4"
      >
        <YStack flex={1}>
          <Header accountAddress={accountAddress} />

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
            <TokenRow accountAddress={accountAddress} tokenName="Ethereum" />
          </YStack>
        </YStack>

        <XStack justifyContent="center" paddingVertical="$4" space="$4">
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
      </SafeAreaStack>
    </PanModal.Offscreen>
  );
}
