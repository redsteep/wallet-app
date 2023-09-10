import { Pressable } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { useAccount } from "wagmi";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { ownedAssets } from "~/features/assets";
import { useTokenPrices } from "~/features/token/hooks/use-token-prices";
import { useWeb3Auth } from "~/lib/web3auth";
import { shortenAddress } from "~/utils/shorten-address";

export function TabHeader() {
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
    <SafeAreaStack
      flex={0}
      paddingTop="$4"
      paddingHorizontal="$4"
      backgroundColor="$backgroundStrong"
      edges={["top"]}
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

        <Pressable onPress={logout}>
          <Text fontWeight="500">Logout</Text>
        </Pressable>
      </XStack>
    </SafeAreaStack>
  );
}
