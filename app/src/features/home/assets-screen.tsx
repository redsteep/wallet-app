import Ionicons from "@expo/vector-icons/Ionicons";
import { PanModal } from "@wallet/pan-modal";
import { Pressable, TouchableOpacity } from "react-native";
import { ScrollView, Text, XStack, YStack } from "tamagui";
import { useAccount } from "wagmi";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { ActionButton } from "~/features/home/components/action-button";
import { TokenRow } from "~/features/home/components/token-row";
import { useWeb3Auth } from "~/lib/web3auth";
import { shortenAddress } from "~/utils/shorten-address";

export function AssetsScreen() {
  const { address } = useAccount();
  const { logout } = useWeb3Auth((state) => state.actions);

  const formattedAddress = address ? shortenAddress(address) : "Loading...";

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

        <XStack alignItems="center" justifyContent="space-between" space="$3">
          <ActionButton destination={{ name: "Receive" }}>
            <ActionButton.Icon backgroundColor="#49CF57">
              <Ionicons name="arrow-down" color="white" size={24} />
            </ActionButton.Icon>
            <ActionButton.Text>Receive</ActionButton.Text>
          </ActionButton>

          <ActionButton destination={{ name: "Transfer" }}>
            <ActionButton.Icon backgroundColor="#119BFF">
              <Ionicons name="arrow-up" color="white" size={24} />
            </ActionButton.Icon>
            <ActionButton.Text>Send</ActionButton.Text>
          </ActionButton>

          <ActionButton destination={{ name: "Transfer" }}>
            <ActionButton.Icon backgroundColor="#B3B3B3">
              <Ionicons name="swap-vertical" color="white" size={24} />
            </ActionButton.Icon>
            <ActionButton.Text>Swap</ActionButton.Text>
          </ActionButton>
        </XStack>
      </SafeAreaStack>
    </PanModal.Offscreen>
  );
}
