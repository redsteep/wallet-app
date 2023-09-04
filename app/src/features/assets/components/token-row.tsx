import { PanModal } from "@wallet/pan-modal";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Circle, Text, XStack, YStack } from "tamagui";
import { P, match } from "ts-pattern";
import { useAccount, useBalance } from "wagmi";
import type { Asset } from "~/features/assets/assets";
import { useCoinData } from "~/features/assets/hooks/use-coin-data";
import { commify } from "~/utils/commify";

interface TokenRowProps {
  asset: Asset;
  asTrigger?: boolean;
  trimDecimals?: boolean;
  showMarketData?: boolean;
  onPress?: () => void;
}

export function TokenRow({
  asset,
  asTrigger = true,
  trimDecimals = true,
  showMarketData = true,
  onPress,
}: TokenRowProps) {
  const { address } = useAccount();
  const { data: coinData } = useCoinData(showMarketData ? asset.coinGeckoId : undefined);
  const { data: balanceData } = useBalance({
    address,
    token: asset.tokenAddress,
    watch: true,
  });

  const marketData = coinData?.market_data;
  const currentUsdPrice = marketData?.current_price.usd ?? 0.0;

  const formattedBalance = commify(
    balanceData
      ? trimDecimals
        ? Number(balanceData.formatted).toFixed(4)
        : balanceData.formatted
      : 0.0,
  );

  const currentValueString = commify(
    balanceData ? (parseFloat(balanceData.formatted) * currentUsdPrice).toFixed(2) : 0.0,
  );

  const priceChangePercentage = marketData?.price_change_percentage_24h ?? 0.0;
  const priceChangePercentageString = commify(priceChangePercentage.toFixed(2));

  const children = (
    <XStack justifyContent="space-between">
      <XStack alignItems="center" space="$2.5">
        <Image
          source={asset.tokenImage}
          style={{
            width: 50,
            height: 50,
            backgroundColor: "black",
            borderRadius: 100,
          }}
        />

        <YStack space="$1.5">
          <Text fontSize="$6" fontWeight="600">
            {asset.tokenName}
          </Text>

          <Text color="$color10" fontSize="$4" fontWeight="500" letterSpacing={0.25}>
            {balanceData ? `${formattedBalance} ${balanceData.symbol}` : "Loading..."}
          </Text>
        </YStack>
      </XStack>

      {showMarketData && (
        <YStack justifyContent="center" alignItems="flex-end" space="$1">
          <Text fontSize="$6" fontWeight="600" letterSpacing={0.25}>
            ${currentValueString}
          </Text>

          {match(priceChangePercentage)
            .with(P.number.positive(), () => (
              <Text color="$green11" fontSize="$4" fontWeight="500" letterSpacing={0.25}>
                ↑ {priceChangePercentageString}%
              </Text>
            ))
            .with(P.number.negative(), () => (
              <Text color="$red10" fontSize="$4" fontWeight="500" letterSpacing={0.25}>
                ↓ {priceChangePercentageString}%
              </Text>
            ))
            .otherwise(() => (
              <Text color="$color10" fontSize="$4" fontWeight="500" letterSpacing={0.25}>
                {priceChangePercentageString}%
              </Text>
            ))}
        </YStack>
      )}
    </XStack>
  );

  return asTrigger ? (
    <PanModal.Trigger onTriggerPress={onPress}>{children}</PanModal.Trigger>
  ) : (
    <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
  );
}
