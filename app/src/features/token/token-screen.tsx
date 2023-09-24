import Ionicons from "@expo/vector-icons/Ionicons";
import type BottomSheet from "@gorhom/bottom-sheet";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { PanModal } from "@wallet/pan-modal";
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";
import { useMemo, useRef } from "react";
import { LineGraph, type GraphPoint } from "react-native-graph";
import { Separator, Text, View, XStack, YStack } from "tamagui";
import { useAccount } from "wagmi";
import { FadingScrollView } from "~/components/fading-scroll-view";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { ActionButton } from "~/features/token/components/action-button";
import { GraphSelectionDot } from "~/features/token/components/graph-selection-dot";
import {
  TokenHeader,
  type TokenHeaderRef,
} from "~/features/token/components/token-header";
import { TokenMarketStat } from "~/features/token/components/token-market-stat";
import { useMarketCharts } from "~/features/token/hooks/use-market-charts";
import { useTokenData } from "~/features/token/hooks/use-token-data";
import { RequestTransferModal } from "~/features/token/modals/request-transfer";
import {
  type AppStackParamList,
  type AppStackScreenProps,
} from "~/navigation/navigators/app-navigator";
import { commify } from "~/utils/commify";

export function TokenScreen({ route }: AppStackScreenProps<"Token">) {
  const headerRef = useRef<TokenHeaderRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();

  const { address } = useAccount();
  const { tokenName, tokenAddress, tokenImage, coinGeckoId } = route.params.token;
  const { tokenData, tokenBalance, currentFiatPrice, priceChangePercentageIn24h } =
    useTokenData({ address, tokenAddress, coinGeckoId });

  const { data: marketChartData, isLoading: isLoadingChartData } = useMarketCharts({
    coinGeckoId,
    days: 1,
  });

  const graphPoints = useMemo<GraphPoint[]>(() => {
    if (marketChartData) {
      return marketChartData.prices.map(([timestamp, value]) => ({
        date: new Date(timestamp),
        value,
      }));
    } else {
      return [];
    }
  }, [marketChartData]);

  const formattedTokenBalance = commify(
    tokenBalance ? parseFloat(tokenBalance.formatted).toFixed(4) : 0.0,
  );

  const formattedValueInFiat = commify(
    tokenBalance
      ? (parseFloat(tokenBalance.formatted) * currentFiatPrice).toFixed(2)
      : 0.0,
  );

  return (
    <PanModal.Content>
      <SafeAreaStack flexDirection="column" backgroundColor="$backgroundStrong">
        <TokenHeader
          ref={headerRef}
          tokenName={tokenName}
          tokenImage={tokenImage}
          tokenPrice={currentFiatPrice}
          priceChangePercentage={priceChangePercentageIn24h}
        />

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
                SelectionDot={GraphSelectionDot}
                verticalPadding={16}
                enablePanGesture
                onGestureStart={() => impactAsync(ImpactFeedbackStyle.Light)}
                onPointSelected={(p) => headerRef.current?.updateTokenPrice(p.value)}
                onGestureEnd={() => headerRef.current?.updateTokenPrice(currentFiatPrice)}
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
                  {formattedTokenBalance} {tokenBalance?.symbol}
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
                  ${formattedValueInFiat}
                </Text>
              </YStack>
            </XStack>

            <Separator />

            {tokenData?.description?.en && (
              <YStack space="$3">
                <XStack alignItems="center" space="$2">
                  <Ionicons name="list" color="black" size={18} />
                  <Text fontSize="$6" fontWeight="500">
                    Description
                  </Text>
                </XStack>

                <Text selectable color="$color10" fontSize="$6" fontWeight="400">
                  {tokenData.description.en.substring(
                    0,
                    tokenData.description.en.indexOf("\n") - 2,
                  )}
                </Text>
              </YStack>
            )}

            {tokenData?.market_data && (
              <YStack>
                <TokenMarketStat
                  index={0}
                  label="Market Cap"
                  value={tokenData.market_data.market_cap.usd}
                  format="abbreviatedCurrency"
                />
                <TokenMarketStat
                  index={1}
                  label="Total Volume"
                  value={tokenData.market_data.total_volume.usd}
                  format="abbreviatedCurrency"
                />
                <TokenMarketStat
                  index={2}
                  label="Circulating Supply"
                  value={tokenData.market_data.circulating_supply}
                />
                <TokenMarketStat
                  index={3}
                  label="Total Supply"
                  value={tokenData.market_data.total_supply}
                />
              </YStack>
            )}
          </YStack>
        </FadingScrollView>

        <XStack padding="$4" space="$3">
          <ActionButton flex={1} onPress={() => navigation.navigate("Receive")}>
            <ActionButton.Icon backgroundColor="#49CF57">
              <Ionicons name="arrow-down" color="white" size={24} />
            </ActionButton.Icon>
            <ActionButton.Text>Receive</ActionButton.Text>
          </ActionButton>

          <ActionButton flex={1} onPress={() => bottomSheetRef.current?.expand()}>
            <ActionButton.Icon backgroundColor="#B3B3B3">
              <Ionicons name="at" color="white" size={24} />
            </ActionButton.Icon>
            <ActionButton.Text>Request</ActionButton.Text>
          </ActionButton>

          <ActionButton flex={1} onPress={() => navigation.navigate("Transfer")}>
            <ActionButton.Icon backgroundColor="#119BFF">
              <Ionicons name="arrow-up" color="white" size={24} />
            </ActionButton.Icon>
            <ActionButton.Text>Send</ActionButton.Text>
          </ActionButton>
        </XStack>
      </SafeAreaStack>

      <RequestTransferModal ref={bottomSheetRef} token={route.params.token} />
    </PanModal.Content>
  );
}
