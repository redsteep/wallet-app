import Ionicons from "@expo/vector-icons/Ionicons";
import { PanModal } from "@wallet/pan-modal";
import { Pressable, TouchableOpacity } from "react-native";
import { ScrollView, Stack, Text, View, XStack, YStack, ZStack } from "tamagui";
import { useAccount } from "wagmi";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { ActionButton } from "~/features/assets/components/action-button";
import { TokenRow } from "~/features/assets/components/token-row";
import { ownedAssets } from "~/features/assets/assets";
import { useWeb3Auth } from "~/lib/web3auth";
import { shortenAddress } from "~/utils/shorten-address";
import { AssetsList } from "~/features/assets/components/assets-list";
import { HomeStackScreenProps } from "~/navigation/navigators/home-navigator";

export function AssetsScreen({ navigation }: HomeStackScreenProps<"Assets">) {
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
        <YStack space="$4">
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

          <AssetsList withTrigger onPress={() => navigation.navigate("Transfer")} />
        </YStack>

        <XStack alignItems="center" justifyContent="space-between" space="$3">
          <ActionButton onTriggerPress={() => navigation.navigate("Receive")}>
            <ActionButton.Icon backgroundColor="#49CF57">
              <Ionicons name="arrow-down" color="white" size={24} />
            </ActionButton.Icon>
            <ActionButton.Text>Receive</ActionButton.Text>
          </ActionButton>

          <ActionButton onTriggerPress={() => navigation.navigate("Transfer")}>
            <ActionButton.Icon backgroundColor="#119BFF">
              <Ionicons name="arrow-up" color="white" size={24} />
            </ActionButton.Icon>
            <ActionButton.Text>Send</ActionButton.Text>
          </ActionButton>

          <ActionButton onTriggerPress={() => navigation.navigate("Transfer")}>
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
