import { PanModal } from "@wallet/pan-modal";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, XStack, YStack } from "tamagui";
import { P, match } from "ts-pattern";
import { useAccount } from "wagmi";
import type { Asset } from "~/features/assets";
import { useTokenData } from "~/features/token/hooks/use-token-data";
import { commify } from "~/utils/commify";

interface TokenButtonProps {
  token: Asset;
  wrapWithPanTrigger?: boolean;
  trimBalanceDecimals?: boolean;
  showFiatPrice?: boolean;
  onPress?: () => void;
}

export function TokenButton({
  token: { tokenName, tokenAddress, tokenImage, coinGeckoId },
  wrapWithPanTrigger = false,
  trimBalanceDecimals = true,
  showFiatPrice = true,
  onPress,
}: TokenButtonProps) {
  const { address } = useAccount();
  const { tokenBalance, currentFiatPrice, priceChangePercentageIn24h } = useTokenData({
    address,
    tokenAddress,
    coinGeckoId,
  });

  const formattedTokenBalance = commify(
    tokenBalance
      ? trimBalanceDecimals
        ? parseFloat(tokenBalance.formatted).toFixed(4)
        : tokenBalance.formatted
      : 0.0,
  );

  const formattedValueInFiat = commify(
    tokenBalance
      ? (parseFloat(tokenBalance.formatted) * currentFiatPrice).toFixed(2)
      : 0.0,
  );

  const formattedPriceChangePercentage =
    commify(priceChangePercentageIn24h.toFixed(2)) + "%";

  const WrapperComponent = wrapWithPanTrigger ? PanModal.Trigger : TouchableOpacity;

  return (
    <WrapperComponent onPress={onPress}>
      <XStack justifyContent="space-between">
        <XStack alignItems="center" space="$2.5">
          <Image
            source={tokenImage}
            style={{
              width: 50,
              height: 50,
              backgroundColor: "black",
              borderRadius: 100,
            }}
          />

          <YStack space="$1.5">
            <Text fontSize="$6" fontWeight="600">
              {tokenName}
            </Text>

            <Text color="$color10" fontSize="$4" fontWeight="500" letterSpacing={0.25}>
              {tokenBalance
                ? `${formattedTokenBalance} ${tokenBalance.symbol}`
                : "Loading..."}
            </Text>
          </YStack>
        </XStack>

        {showFiatPrice && (
          <YStack justifyContent="center" alignItems="flex-end" space="$1">
            <Text fontSize="$6" fontWeight="600" letterSpacing={0.25}>
              ${formattedValueInFiat}
            </Text>

            {match(priceChangePercentageIn24h)
              .with(P.number.positive(), () => (
                <Text
                  color="$green11"
                  fontSize="$4"
                  fontWeight="500"
                  letterSpacing={0.25}
                >
                  ↑ {formattedPriceChangePercentage}
                </Text>
              ))
              .with(P.number.negative(), () => (
                <Text color="$red10" fontSize="$4" fontWeight="500" letterSpacing={0.25}>
                  ↓ {formattedPriceChangePercentage}
                </Text>
              ))
              .otherwise(() => (
                <Text
                  color="$color10"
                  fontSize="$4"
                  fontWeight="500"
                  letterSpacing={0.25}
                >
                  {formattedPriceChangePercentage}
                </Text>
              ))}
          </YStack>
        )}
      </XStack>
    </WrapperComponent>
  );
}
