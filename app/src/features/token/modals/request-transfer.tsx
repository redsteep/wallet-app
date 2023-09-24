import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";
import { forwardRef, useState } from "react";
import { Share } from "react-native";
import { Button, Text, Theme, XStack, YStack } from "tamagui";
import { P, match } from "ts-pattern";
import { parseUnits } from "viem";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { type Asset } from "~/features/assets";
import { chunkArray } from "~/utils/chunk-array";
import * as Linking from "expo-linking";

const symbolChunks = chunkArray("123456789.0<".split(""), 3);

interface RequestTransferModalProps {
  token: Asset;
}

export const RequestTransferModal = forwardRef<BottomSheet, RequestTransferModalProps>(
  ({ token }, ref) => {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { data } = useBalance({
      address,
      token: token.tokenAddress,
      watch: true,
    });

    const [inputValue, setInputValue] = useState("0");
    const parsedUnits = parseUnits(inputValue, data?.decimals ?? 18);

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

    const shareTransferUrl = async () => {
      if (ref && "current" in ref) {
        ref.current?.close();
      }

      Share.share({
        url: Linking.createURL("transfer", {
          queryParams: {
            chainId: String(chain?.id),
            recipientAddress: address,
            tokenAddress: token.tokenAddress,
            value: String(parsedUnits),
          },
        }),
      });
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={["75%"]}
        enablePanDownToClose={true}
        onClose={() => setInputValue("0")}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
        )}
      >
        <SafeAreaStack justifyContent="space-between" padding="$4" edges={["bottom"]}>
          <YStack flex={1} alignItems="center" justifyContent="center">
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

          <YStack alignItems="center" space="$4">
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
                onPress={shareTransferUrl}
                opacity={parsedUnits > 0 ? 1.0 : 0.75}
                disabled={parsedUnits <= 0}
              >
                <Button.Text fontSize="$6" fontWeight="600">
                  Share Request Link
                </Button.Text>
              </Button>
            </Theme>
          </YStack>
        </SafeAreaStack>
      </BottomSheet>
    );
  },
);
