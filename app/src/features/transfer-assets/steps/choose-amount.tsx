import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";
import { useDeferredValue, useState } from "react";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
} from "react-native-reanimated";
import { Button, Text, Theme, View, XStack, YStack } from "tamagui";
import { P, match } from "ts-pattern";
import { parseUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { TokenRow } from "~/features/assets/components/token-row";
import { useTransferContext } from "~/features/transfer-assets/context";
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
  const parsedUnits = useDeferredValue(parseUnits(inputValue, data?.decimals ?? 18));

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
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="space-between"
        paddingVertical="$6"
      >
        {/* <Text fontSize="$12" fontWeight="700">
          $
        </Text> */}
        <Text
          height="$10"
          fontSize="$14"
          fontWeight="700"
          adjustsFontSizeToFit
          textAlign="center"
          textAlignVertical="center"
          alignSelf="center"
          numberOfLines={1}
        >
          {inputValue}
        </Text>

        {!enoughBalance && (
          <AnimatedText
            color="$red10"
            fontSize="$6"
            fontWeight="600"
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
          <View
            width="100%"
            backgroundColor="$backgroundPress"
            borderRadius="$6"
            paddingVertical="$3"
            paddingHorizontal="$4"
          >
            <TokenRow
              tokenName={transferAsset.tokenName}
              token={transferAsset.tokenAddress}
              onPress={actions.setTransferAsset}
              withPreciseFormatting
            />
          </View>
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
            size="$4"
            width="100%"
            onPress={() => actions.setTransferValue(parsedUnits)}
            opacity={validAmount ? 1.0 : 0.75}
            disabled={!validAmount}
          >
            <Button.Text fontSize="$6" fontWeight="500">
              Continue
            </Button.Text>
          </Button>
        </Theme>
      </YStack>
    </YStack>
  );
}
