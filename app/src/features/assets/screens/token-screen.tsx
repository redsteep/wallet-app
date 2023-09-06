import Ionicons from "@expo/vector-icons/Ionicons";
import { PanModal } from "@wallet/pan-modal";
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { Pressable } from "react-native";
import { LineGraph, type GraphPoint } from "react-native-graph";
import { Separator, Text, View, XStack, YStack, useTheme } from "tamagui";
import { P, match } from "ts-pattern";
import { useAccount, useBalance } from "wagmi";
import { FadingScrollView } from "~/components/fading-scroll-view";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { SelectionDot } from "~/features/assets/components/selection-dot";
import { TokenStatistic } from "~/features/assets/components/token-statistic";
import { useCoinData } from "~/features/assets/hooks/use-coin-data";
import { useMarketChart } from "~/features/assets/hooks/use-market-charts";
import { type AppStackScreenProps } from "~/navigation/navigators/app-navigator";
import { commify } from "~/utils/commify";

export function TokenScreen({ route, navigation }: AppStackScreenProps<"Token">) {
  const theme = useTheme();

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
  const [priceTitle, setPriceTitle] = useState(currentUsdPrice);

  // TODO: Move price and graph out of this root screen component as
  // frequently rerendering an entire screen kills JS thread completely
  const updatePriceTitle = (point?: GraphPoint) => {
    setPriceTitle(point?.value ?? currentUsdPrice);
  };

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
            <Image
              source={asset.tokenImage}
              style={{
                width: 60,
                height: 60,
                backgroundColor: "black",
                borderRadius: 100,
                marginBottom: 8,
              }}
            />

            <Text fontSize="$8" fontWeight="700">
              {asset.tokenName}
            </Text>

            <Text fontSize="$8" fontWeight="600" color="$color10" letterSpacing={0.25}>
              ${commify(priceTitle.toFixed(2))}
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
                style={{
                  width: "100%",
                  height: 175,
                }}
                points={graphPoints}
                animated={true}
                color="#000000"
                lineThickness={4}
                SelectionDot={SelectionDot}
                verticalPadding={16}
                enablePanGesture
                onGestureStart={() => impactAsync(ImpactFeedbackStyle.Light)}
                onPointSelected={(p) => updatePriceTitle(p)}
                onGestureEnd={() => updatePriceTitle()}
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
              <YStack space="$3">
                <XStack alignItems="center" space="$2">
                  <Ionicons name="list" color={theme.color10.get()} size={18} />
                  <Text fontSize="$6" fontWeight="500">
                    Description
                  </Text>
                </XStack>

                <Text selectable color="$color10" fontSize="$6" fontWeight="400">
                  {coinData.description.en.substring(
                    0,
                    coinData.description.en.indexOf("\n") - 2,
                  )}
                </Text>
              </YStack>
            )}

            {marketData && (
              <YStack>
                <TokenStatistic
                  index={0}
                  label="Market Cap"
                  value={marketData.market_cap.usd}
                  format="abbreviatedCurrency"
                />

                <TokenStatistic
                  index={1}
                  label="Total Volume"
                  value={marketData.total_volume.usd}
                  format="abbreviatedCurrency"
                />

                <TokenStatistic
                  index={2}
                  label="Circulating Supply"
                  value={marketData.circulating_supply}
                />

                <TokenStatistic
                  index={3}
                  label="Total Supply"
                  value={marketData.total_supply}
                />
              </YStack>
            )}
          </YStack>
        </FadingScrollView>
      </SafeAreaStack>
    </PanModal.Content>
  );
}
