import Ionicons from "@expo/vector-icons/Ionicons";
import { PanModal } from "@wallet/pan-modal";
import { TouchableOpacity } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { useAccount } from "wagmi";
import { FadingScrollView } from "~/components/fading-scroll-view";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { type Asset } from "~/features/assets";
import { ActionButton } from "~/features/assets/components/action-button";
import { TokenButton } from "~/features/token/components/token-button";
import { useTokenPrices } from "~/features/token/hooks/use-token-prices";
import { useWeb3Auth } from "~/lib/web3auth";
import { type TabScreenProps } from "~/navigation/navigators/app-navigator";
import { shortenAddress } from "~/utils/shorten-address";

// TODO: move away from predefined assets
export const ownedAssets: Asset[] = [
  {
    tokenName: "Ethereum",
    tokenImage: require("assets/ethereum.png"),
    coinGeckoId: "ethereum",
  },
  {
    tokenName: "Stackup Test Token",
    tokenAddress: "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B",
  },
];

export function AssetsScreen({ navigation }: TabScreenProps<"Assets">) {
  const { address } = useAccount();
  const { logout } = useWeb3Auth((state) => state.actions);

  const { data: tokenPrices } = useTokenPrices({
    address: address!,
    tokens: ownedAssets.filter((asset) => !!asset.coinGeckoId),
    againstCurrency: "usd",
  });

  const totalPortfolioValue = (tokenPrices ?? []).reduce(
    (acc, [balance, priceData]) =>
      acc + (balance ? parseFloat(balance.formatted) * priceData : 0.0),
    0.0,
  );

  const formattedAddress = address ? shortenAddress(address) : "Loading...";
  const formattedPortfolioValue = totalPortfolioValue.toFixed(2);

  return (
    <PanModal.Offscreen>
      <SafeAreaStack
        flexDirection="column"
        justifyContent="space-between"
        backgroundColor="$backgroundStrong"
        edges={["top", "left", "right"]}
        padding="$4"
        space="$4"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <YStack>
            <Text color="$color10" fontSize="$6" letterSpacing={0.25}>
              {formattedAddress}
            </Text>

            <Text fontSize="$10" fontWeight="700">
              ${formattedPortfolioValue}
            </Text>
          </YStack>

          <TouchableOpacity onPress={logout}>
            <Text fontWeight="500">Logout</Text>
          </TouchableOpacity>
        </XStack>

        <FadingScrollView>
          <YStack space="$4">
            <Text fontSize="$6" fontWeight="600">
              Tokens
            </Text>

            {ownedAssets.map((token, idx) => (
              <TokenButton
                key={idx}
                token={token}
                onPress={() => navigation.navigate("Token", { token })}
                wrapWithPanTrigger
                trimBalanceDecimals
                showFiatPrice
              />
            ))}
          </YStack>
        </FadingScrollView>

        <XStack alignItems="center" justifyContent="space-between" space="$3">
          <ActionButton onPress={() => navigation.navigate("Receive")}>
            <ActionButton.Icon backgroundColor="#49CF57">
              <Ionicons name="arrow-down" color="white" size={24} />
            </ActionButton.Icon>
            <ActionButton.Text>Receive</ActionButton.Text>
          </ActionButton>

          <ActionButton onPress={() => navigation.navigate("Transfer")}>
            <ActionButton.Icon backgroundColor="#119BFF">
              <Ionicons name="arrow-up" color="white" size={24} />
            </ActionButton.Icon>
            <ActionButton.Text>Send</ActionButton.Text>
          </ActionButton>

          <ActionButton onPress={() => navigation.navigate("Transfer")}>
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
