import Ionicons from "@expo/vector-icons/Ionicons";
import { PanModal } from "@wallet/pan-modal";
import { useMemo } from "react";
import { Pressable } from "react-native";
import { LineGraph, type GraphPoint } from "react-native-graph";
import { Separator, Stack, Text, View, XStack, YStack } from "tamagui";
import { P, match } from "ts-pattern";
import { useAccount, useBalance } from "wagmi";
import { FadingScrollView } from "~/components/fading-scroll-view";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { SelectionDot } from "~/features/assets/components/selection-dot";
import { useCoinData } from "~/features/assets/hooks/use-coin-data";
import { useMarketChart } from "~/features/assets/hooks/use-market-charts";
import { type HomeStackScreenProps } from "~/navigation/navigators/home-navigator";
import { commify } from "~/utils/commify";

export function TokenScreen({ route, navigation }: HomeStackScreenProps<"Token">) {
  const { asset } = route.params;

  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    token: asset.tokenAddress,
    watch: true,
  });

  const { data: coinData } = useCoinData(asset.coinGeckoId);
  const { data: marketChartData, isLoading: isLoadingChartData } = useMarketChart({
    coinGeckoId: asset.coinGeckoId,
    days: 1,
  });

  const graphPoints = useMemo<GraphPoint[]>(() => {
    if (!marketChartData) {
      return [];
    }
    return marketChartData.prices.map(([timestamp, value]) => ({
      date: new Date(timestamp),
      value,
    }));
  }, [marketChartData]);

  const marketData = coinData?.market_data;
  const currentUsdPrice = marketData?.current_price.usd ?? 0.0;
  const currentUsdPriceString = commify(currentUsdPrice.toFixed(2));

  const priceChangePercentage = marketData?.price_change_percentage_24h ?? 0.0;
  const priceChangePercentageString = commify(priceChangePercentage.toFixed(2));

  const formattedBalance = commify(
    balanceData ? Number(balanceData.formatted).toFixed(4) : 0.0,
  );
  const currentValueString = commify(
    balanceData ? (parseFloat(balanceData.formatted) * currentUsdPrice).toFixed(2) : 0.0,
  );

  return (
    <PanModal.Content>
      <SafeAreaStack flexDirection="column" backgroundColor="$backgroundStrong">
        <XStack justifyContent="space-between" padding="$4">
          <YStack space="$1.5">
            <Stack
              width="$5"
              height="$5"
              borderRadius="$10"
              backgroundColor="$color"
              marginBottom="$2"
            />

            <Text fontSize="$8" fontWeight="700">
              {asset.tokenName}
            </Text>

            <Text fontSize="$8" fontWeight="600" color="$color10" letterSpacing={0.25}>
              ${currentUsdPriceString}
            </Text>
          </YStack>

          <YStack justifyContent="space-between" alignItems="flex-end">
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={28} />
            </Pressable>

            {match(priceChangePercentage)
              .with(P.number.positive(), () => (
                <Text
                  color="$green11"
                  fontSize="$8"
                  fontWeight="600"
                  letterSpacing={0.25}
                >
                  ↑ {priceChangePercentageString}%
                </Text>
              ))
              .with(P.number.negative(), () => (
                <Text color="$red10" fontSize="$8" fontWeight="600" letterSpacing={0.25}>
                  ↓ {priceChangePercentageString}%
                </Text>
              ))
              .otherwise(() => (
                <Text
                  color="$color10"
                  fontSize="$8"
                  fontWeight="600"
                  letterSpacing={0.25}
                >
                  {priceChangePercentageString}%
                </Text>
              ))}
          </YStack>
        </XStack>

        <FadingScrollView showsVerticalScrollIndicator={false}>
          <View width="100%" height={175}>
            {isLoadingChartData || graphPoints.length > 0 ? (
              <LineGraph
                style={{ flex: 1 }}
                points={graphPoints}
                animated={true}
                color="#000000"
                lineThickness={4}
                SelectionDot={SelectionDot}
                verticalPadding={16}
                enablePanGesture
              />
            ) : (
              <YStack flex={1} justifyContent="center" alignItems="center" space="$2">
                <Ionicons name="briefcase-outline" size={32} />
                <Text fontSize="$6" fontWeight="600">
                  No Market Data for This Coin
                </Text>
              </YStack>
            )}
          </View>

          <YStack padding="$4" space="$4">
            <Separator />

            <XStack justifyContent="space-between" paddingVertical="$2">
              <YStack flex={1} alignItems="center" paddingHorizontal="$4" space="$1.5">
                <Text fontSize="$5" fontWeight="500" color="$color10">
                  You Own
                </Text>

                <Text
                  fontSize="$7"
                  fontWeight="600"
                  letterSpacing={0.25}
                  textAlign="center"
                  textAlignVertical="center"
                  adjustsFontSizeToFit={true}
                  allowFontScaling={false}
                  numberOfLines={1}
                >
                  {formattedBalance} {balanceData?.symbol}
                </Text>
              </YStack>

              <Separator vertical />

              <YStack flex={1} alignItems="center" paddingHorizontal="$4" space="$1.5">
                <Text fontSize="$5" fontWeight="500" color="$color10">
                  Value
                </Text>

                <Text
                  fontSize="$7"
                  fontWeight="600"
                  letterSpacing={0.25}
                  textAlign="center"
                  textAlignVertical="center"
                  adjustsFontSizeToFit={true}
                  allowFontScaling={false}
                  numberOfLines={1}
                >
                  ${currentValueString}
                </Text>
              </YStack>
            </XStack>

            <Separator />

            {coinData?.description.en && (
              <YStack space="$2">
                <XStack alignItems="center" space="$2">
                  <Ionicons name="information-circle" size={24} />
                  <Text fontSize="$6" fontWeight="600">
                    Description
                  </Text>
                </XStack>

                <Text
                  selectable
                  color="$color10"
                  fontSize="$5"
                  fontWeight="500"
                  letterSpacing={0.25}
                >
                  {coinData.description.en}
                </Text>
              </YStack>
            )}

            {/* {marketData && (
              <YStack>
                <XStack alignItems="center" paddingBottom="$2" space="$2">
                  <Ionicons name="stats-chart" size={24} />
                  <Text fontSize="$6" fontWeight="600">
                    Statistics
                  </Text>
                </XStack>

                {[
                  ["Total Volume", marketData.total_volume.usd],
                  ["Total Supply", marketData.total_supply],
                  ["Circulating Supply", marketData.circulating_supply],
                ].map(([label, value], idx) => (
                  <XStack
                    justifyContent="space-between"
                    alignItems="center"
                    backgroundColor={idx % 2 !== 0 ? "$backgroundHover" : undefined}
                    borderRadius="$4"
                    padding="$2"
                  >
                    <Text fontSize="$5" fontWeight="500">
                      {label}
                    </Text>
                    <Text fontSize="$5" fontWeight="500">
                      {value}
                    </Text>
                  </XStack>
                ))}

                <Text
                  selectable
                  color="$color10"
                  fontSize="$5"
                  fontWeight="500"
                  letterSpacing={0.25}
                >
                  {coinData.description.en}
                </Text>
              </YStack>
            )} */}
          </YStack>
        </FadingScrollView>
      </SafeAreaStack>
    </PanModal.Content>
  );
}
