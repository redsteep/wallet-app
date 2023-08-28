import Ionicons from "@expo/vector-icons/Ionicons";
import {
  PanModalPresentationState,
  usePanModalContext,
} from "@wallet/pan-modal/src/context";
import * as Clipboard from "expo-clipboard";
import { useRef, useState } from "react";
import { Keyboard, type TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutLeft,
  Layout,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";
import { Button, Circle, Input, Text, Theme, XStack, YStack, useTheme } from "tamagui";
import { P, match } from "ts-pattern";
import { isAddress, type Address } from "viem";
import { useBalance } from "wagmi";
import { useTransferContext } from "~/features/transfer-assets/context";
import { useDebounce } from "~/utils/hooks/use-debounce";
import { shortenAddress } from "~/utils/shorten-address";

const AnimatedInput = Animated.createAnimatedComponent(Input);
const AnimatedButton = Animated.createAnimatedComponent(Button);
const AnimatedXStack = Animated.createAnimatedComponent(XStack);

export function RecipientSelector() {
  const theme = useTheme();
  const { presentationState } = usePanModalContext();
  const { recipientAddress: chosenRecipientAddress, actions } = useTransferContext();

  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState(chosenRecipientAddress ?? "");

  const pasteFromClipboard = () => Clipboard.getStringAsync().then(setInputValue);
  const recipientAddress = useDebounce(inputValue.trim()) as Address;

  const { data: recipientBalance } = useBalance({
    address: recipientAddress,
    enabled: isAddress(recipientAddress),
  });

  const formattedRecipientBalance = Number(recipientBalance?.formatted).toFixed(4);

  const focusOnInput = () => inputRef.current?.focus();
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

  return (
    <YStack space="$4">
      {match(chosenRecipientAddress)
        .with(P.nullish, () => (
          <XStack alignItems="center" space="$2">
            <AnimatedInput
              ref={inputRef}
              value={inputValue}
              onChangeText={setInputValue}
              flex={1}
              size="$4"
              fontSize="$5"
              fontWeight="600"
              placeholder="ENS or Address"
              autoCapitalize="none"
              autoCorrect={false}
              inputMode="text"
              layout={Layout.springify()
                .mass(0.15)
                .damping(8)
                .stiffness(60)
                .overshootClamping(1)}
              exiting={FadeOutLeft.springify()
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
                  <Button.Text fontSize="$5" fontWeight="600">
                    Paste
                  </Button.Text>
                </AnimatedButton>
              </Theme>
            )}
          </XStack>
        ))
        .with(P.string, () => (
          <AnimatedXStack
            alignItems="center"
            space="$2"
            entering={FadeInRight.springify()
              .mass(0.15)
              .damping(8)
              .stiffness(60)
              .overshootClamping(1)}
            exiting={FadeOut}
          >
            <Text fontSize="$6" fontWeight="600">
              To:
            </Text>

            <Button
              onPress={() => actions.setRecipientAddress()}
              paddingVertical="$3"
              paddingHorizontal="$4"
              backgroundColor="$background"
              hoverStyle={{ backgroundColor: "$backgroundHover" }}
              pressStyle={{ backgroundColor: "$backgroundPress" }}
              borderRadius="$8"
              overflow="hidden"
              unstyled
            >
              <Text fontSize="$5" fontWeight="600">
                {shortenAddress(chosenRecipientAddress!)}
              </Text>
            </Button>
          </AnimatedXStack>
        ))
        .exhaustive()}

      {!chosenRecipientAddress &&
        match(recipientAddress)
          .when(isAddress, () => (
            <YStack space="$4">
              <AnimatedXStack
                key="matching"
                alignItems="center"
                space="$2"
                entering={FadeInDown.springify()
                  .mass(0.15)
                  .damping(8)
                  .stiffness(80)
                  .overshootClamping(1)}
                exiting={FadeOut.duration(150)}
              >
                <Ionicons name="checkmark-circle" color={theme.color10.get()} size={18} />
                <Text color="$color10" fontSize="$6" fontWeight="600">
                  Matching
                </Text>
              </AnimatedXStack>

              <TouchableOpacity
                onPress={() => actions.setRecipientAddress(recipientAddress!)}
              >
                <AnimatedXStack
                  alignItems="center"
                  space="$2.5"
                  entering={FadeInUp.springify()
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
                  <Circle size="$4.5" backgroundColor="$backgroundFocus">
                    <Ionicons name="wallet" size={24} style={{ paddingLeft: 4 }} />
                  </Circle>

                  <YStack space="$1.5">
                    <Text fontSize="$6" fontWeight="600">
                      {shortenAddress(recipientAddress)}
                    </Text>

                    <Text color="$color10">
                      {recipientBalance
                        ? `${formattedRecipientBalance} ${recipientBalance.symbol}`
                        : "Loading..."}
                    </Text>
                  </YStack>
                </AnimatedXStack>
              </TouchableOpacity>
            </YStack>
          ))
          .when(
            (value: Address) => value.length > 0,
            () => (
              <AnimatedXStack
                alignItems="center"
                space="$2"
                entering={FadeInDown.springify()
                  .mass(0.15)
                  .damping(8)
                  .stiffness(80)
                  .overshootClamping(1)}
                exiting={FadeOut.duration(150)}
              >
                <Text color="$color10" fontSize="$6" fontWeight="600">
                  No results found :(
                </Text>
              </AnimatedXStack>
            ),
          )
          .otherwise(() => null)}
    </YStack>
  );
}
