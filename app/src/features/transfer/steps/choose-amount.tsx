import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";
import { useState } from "react";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { Button, Text, Theme, XStack, YStack } from "tamagui";
import { P, match } from "ts-pattern";
import { parseUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { TokenButton } from "~/features/token/components/token-button";
import { useTransferContext } from "~/features/transfer/context";
import { chunkArray } from "~/utils/chunk-array";

const symbolChunks = chunkArray("123456789.0<".split(""), 3);

const AnimatedText = Animated.createAnimatedComponent(Text);

export function ChooseAmountStep() {
  const { address } = useAccount();
  const { transferAsset, actions } = useTransferContext();

  const { data } = useBalance({
    address,
    token: transferAsset?.tokenAddress,
    watch: true,
  });

  const [inputValue, setInputValue] = useState("0");
  const parsedUnits = parseUnits(inputValue, data?.decimals ?? 18);

  const enoughBalance = parsedUnits <= (data?.value ?? 0n);
  const validAmount = parsedUnits > 0 && enoughBalance;

  const appendSymbol = (symbol: string) => {
    impactAsync(ImpactFeedbackStyle.Light);
    setInputValue((currentValue) => {
      return match([symbol, currentValue])
        .with(["<", P.string.select()], (value) => value.slice(0, -1) || "0")
        .with([".", P.not(P.string.includes(".")).select()], (value) => `${value}.`)
        .with([P.string.select(), "0"], (symbol) => symbol)
        .with([P.string, P.string], ([symbol, value]) => {
          if (symbol === "." && value.endsWith(".")) {
            return value;
          }
          try {
            const newValue = value + symbol;
            parseFloat(newValue);
            return newValue;
          } catch {
            return value;
          }
        })
        .exhaustive();
    });
  };

  return (
    <YStack flex={1} justifyContent="space-between">
      <YStack flex={1} alignItems="center" justifyContent="space-between">
        <YStack flex={1} justifyContent="center">
          <Text
            fontSize="$14"
            fontWeight="700"
            textAlign="center"
            textAlignVertical="center"
            adjustsFontSizeToFit
            allowFontScaling={false}
            numberOfLines={1}
          >
            {inputValue}
          </Text>
        </YStack>

        {!enoughBalance && (
          <AnimatedText
            color="$red10"
            fontSize="$6"
            fontWeight="600"
            paddingBottom="$6"
            entering={FadeInDown.springify()
              .mass(0.15)
              .damping(8)
              .stiffness(80)
              .overshootClamping(1)}
            exiting={FadeOutDown.springify()
              .mass(0.15)
              .damping(8)
              .stiffness(80)
              .overshootClamping(1)}
          >
            Not enough {data?.symbol}
          </AnimatedText>
        )}
      </YStack>

      <YStack alignItems="center" space="$4">
        {transferAsset && (
          <XStack
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="$color4"
            borderRadius="$6"
            padding="$3"
            space="$2"
          >
            <TokenButton
              token={transferAsset}
              onPress={() => actions.setTransferAsset()}
              trimBalanceDecimals={false}
              showFiatPrice={false}
            />

            {/* <Theme inverse>
              <Button size="$2" fontWeight="600" borderRadius="$10">
                Use Max
              </Button>
            </Theme> */}
          </XStack>
        )}

        <YStack width="100%" space="$4">
          {symbolChunks.map((symbols, idx) => (
            <XStack key={idx} justifyContent="space-around">
              {symbols.map((symbol, idx) => (
                <Button
                  key={idx}
                  width="$6"
                  height="$5"
                  fontSize="$8"
                  fontWeight="600"
                  backgroundColor="transparent"
                  onPress={() => appendSymbol(symbol)}
                >
                  {symbol}
                </Button>
              ))}
            </XStack>
          ))}
        </YStack>

        <Theme name="dark">
          <Button
            size="$5"
            width="100%"
            onPress={() => actions.setTransferValue(parsedUnits)}
            opacity={validAmount ? 1.0 : 0.75}
            disabled={!validAmount}
          >
            <Button.Text fontSize="$6" fontWeight="600">
              Continue
            </Button.Text>
          </Button>
        </Theme>
      </YStack>
    </YStack>
  );
}
