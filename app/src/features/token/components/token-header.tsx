import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Image, type ImageSource } from "expo-image";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Pressable } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { P, match } from "ts-pattern";
import { commify } from "~/utils/commify";

export interface TokenHeaderRef {
  updateTokenPrice: (tokenPrice: number) => void;
}

interface TokenHeaderProps {
  tokenName: string;
  tokenImage?: ImageSource;
  tokenPrice: number;
  priceChangePercentage: number;
}

export const TokenHeader = forwardRef<TokenHeaderRef, TokenHeaderProps>(
  ({ tokenName, tokenImage, tokenPrice, priceChangePercentage }, ref) => {
    const navigation = useNavigation();
    const [priceTitle, setPriceTitle] = useState(tokenPrice);

    useImperativeHandle(ref, () => ({
      updateTokenPrice: setPriceTitle,
    }));

    const formattedPrice = commify(priceTitle.toFixed(2));
    const formattedPriceChange = `${commify(priceChangePercentage.toFixed(2))}%`;

    return (
      <XStack justifyContent="space-between" padding="$4">
        <YStack space="$1.5">
          <Image
            source={tokenImage}
            style={{
              width: 60,
              height: 60,
              backgroundColor: "black",
              borderRadius: 100,
              marginBottom: 8,
            }}
          />

          <Text fontSize="$8" fontWeight="700">
            {tokenName}
          </Text>

          <Text fontSize="$8" fontWeight="600" color="$color10" letterSpacing={0.25}>
            ${formattedPrice}
          </Text>
        </YStack>

        <YStack justifyContent="space-between" alignItems="flex-end">
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} />
          </Pressable>

          {match(priceChangePercentage)
            .with(P.number.positive(), () => (
              <Text color="$green11" fontSize="$8" fontWeight="600" letterSpacing={0.25}>
                ↑ {formattedPriceChange}
              </Text>
            ))
            .with(P.number.negative(), () => (
              <Text color="$red10" fontSize="$8" fontWeight="600" letterSpacing={0.25}>
                ↓ {formattedPriceChange}
              </Text>
            ))
            .otherwise(() => (
              <Text color="$color10" fontSize="$8" fontWeight="600" letterSpacing={0.25}>
                {formattedPriceChange}
              </Text>
            ))}
        </YStack>
      </XStack>
    );
  },
);
