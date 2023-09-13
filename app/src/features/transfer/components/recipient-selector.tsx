import Ionicons from "@expo/vector-icons/Ionicons";
import {
  PanModalPresentationState,
  usePanModalContext,
} from "@wallet/pan-modal/src/context";
import * as Clipboard from "expo-clipboard";
import { useRef, useState } from "react";
import { Keyboard, type TextInput } from "react-native";
import Animated, {
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutLeft,
  Layout,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";
import { Button, Circle, Input, Text, Theme, XStack, YStack } from "tamagui";
import { P, match } from "ts-pattern";
import { isAddress, type Address } from "viem";
import { useBalance } from "wagmi";
import { useTransferContext } from "~/features/transfer/context";
import { useDebounce } from "~/utils/hooks/use-debounce";
import { usePrevious } from "~/utils/hooks/use-previous";
import { shortenAddress } from "~/utils/shorten-address";

const AnimatedInput = Animated.createAnimatedComponent(Input);
const AnimatedButton = Animated.createAnimatedComponent(Button);
const AnimatedXStack = Animated.createAnimatedComponent(XStack);

export function RecipientSelector() {
  const transferContext = useTransferContext();
  const { presentationState } = usePanModalContext();

  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState(transferContext.recipientAddress ?? "");

  const recipientAddress = useDebounce(inputValue.trim()) as Address;
  const prevRecipientAddress = usePrevious(recipientAddress);
  const validRecipientAddress = isAddress(recipientAddress);

  const { data: recipientBalance } = useBalance({
    address: recipientAddress,
    enabled: validRecipientAddress,
  });

  const formattedRecipientBalance = Number(
    recipientBalance ? recipientBalance.formatted : 0.0,
  ).toFixed(4);

  const focusOnInput = () => inputRef.current?.focus();
  const pasteFromClipboard = () => Clipboard.getStringAsync().then(setInputValue);
  const dismissKeyboard = () => Keyboard.dismiss();

  useAnimatedReaction(
    () => presentationState.value,
    (state) => {
      if (state === PanModalPresentationState.Presented) {
        runOnJS(focusOnInput)();
      } else if (
        state === PanModalPresentationState.Dragging ||
        state === PanModalPresentationState.Dismissing
      ) {
        runOnJS(dismissKeyboard)();
      }
    },
  );

  if (
    typeof transferContext.recipientAddress !== "undefined" &&
    typeof transferContext.transferAsset !== "undefined" &&
    typeof transferContext.transferValue !== "undefined"
  ) {
    return null;
  }

  return (
    <YStack space="$4">
      <AnimatedXStack
        key={transferContext.recipientAddress}
        alignItems="center"
        space="$2"
        entering={FadeInRight.springify()
          .mass(0.15)
          .damping(8)
          .stiffness(60)
          .overshootClamping(1)}
        exiting={FadeOutLeft.springify()
          .mass(0.15)
          .damping(8)
          .stiffness(60)
          .overshootClamping(1)}
      >
        {match(transferContext.recipientAddress)
          .with(P.nullish, () => (
            <XStack alignItems="center" space="$2">
              <AnimatedInput
                ref={inputRef}
                flex={1}
                size="$4"
                fontSize="$6"
                fontWeight="600"
                inputMode="text"
                autoCapitalize="none"
                autoCorrect={false}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="ENS or Address"
                layout={Layout.springify()
                  .mass(0.15)
                  .damping(8)
                  .stiffness(60)
                  .overshootClamping(1)}
              />

              {inputValue.trim().length <= 0 && (
                <Theme inverse>
                  <AnimatedButton
                    size="$4"
                    onPress={pasteFromClipboard}
                    entering={FadeInRight.springify()
                      .mass(0.15)
                      .damping(8)
                      .stiffness(60)
                      .overshootClamping(1)}
                    exiting={FadeOut}
                  >
                    <Button.Text fontSize="$6" fontWeight="600">
                      Paste
                    </Button.Text>
                  </AnimatedButton>
                </Theme>
              )}
            </XStack>
          ))
          .with(P.string, () => (
            <XStack alignItems="center" space="$2">
              <Text fontSize="$6" fontWeight="600">
                To:
              </Text>

              <Button
                onPress={() => transferContext.actions.setRecipientAddress()}
                hoverStyle={{ backgroundColor: "$backgroundHover" }}
                pressStyle={{ backgroundColor: "$backgroundPress" }}
                paddingVertical="$3"
                paddingHorizontal="$4"
                backgroundColor="$background"
                borderRadius="$8"
                overflow="hidden"
                unstyled
              >
                <Text fontSize="$5" fontWeight="600">
                  {shortenAddress(transferContext.recipientAddress!)}
                </Text>
              </Button>
            </XStack>
          ))
          .exhaustive()}
      </AnimatedXStack>

      {!transferContext.recipientAddress && (
        <AnimatedXStack
          key={`${recipientAddress}${transferContext.recipientAddress}`}
          onPress={() => transferContext.actions.setRecipientAddress(recipientAddress!)}
          disabled={!isAddress(recipientAddress)}
          pressStyle={{ opacity: 0.75 }}
          entering={(prevRecipientAddress ? FadeInRight : FadeInUp)
            .springify()
            .mass(0.15)
            .damping(8)
            .stiffness(60)
            .overshootClamping(1)}
          exiting={FadeOutLeft.springify()
            .mass(0.15)
            .damping(8)
            .stiffness(60)
            .overshootClamping(1)}
        >
          {match(recipientAddress)
            .when(isAddress, () => (
              <XStack alignItems="center" space="$2.5">
                <Circle size="$4.5" backgroundColor="$color5">
                  <Ionicons name="wallet" size={24} style={{ paddingLeft: 4 }} />
                </Circle>

                <YStack space="$1.5">
                  <Text fontSize="$6" fontWeight="600" letterSpacing={0.25}>
                    {shortenAddress(recipientAddress)}
                  </Text>

                  <Text
                    fontSize="$4"
                    fontWeight="500"
                    color="$color10"
                    letterSpacing={0.25}
                  >
                    {recipientBalance
                      ? `${formattedRecipientBalance} ${recipientBalance.symbol}`
                      : "Loading..."}
                  </Text>
                </YStack>
              </XStack>
            ))
            .when(
              (value: string) => value.length > 0,
              () => (
                <Text color="$color10" fontSize="$6" fontWeight="600">
                  No results found :(
                </Text>
              ),
            )
            .otherwise(() => null)}
        </AnimatedXStack>
      )}
    </YStack>
  );
}
