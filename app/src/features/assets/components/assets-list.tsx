import { Pressable } from "react-native";
import { ScrollView, Text, YStack } from "tamagui";
import { type Asset, ownedAssets } from "~/features/assets/assets";
import { TokenRow } from "~/features/assets/components/token-row";

interface AssetsListProps {
  withTrigger?: boolean;
  onPress: (asset: Asset) => void;
}

export function AssetsList({ withTrigger = false, onPress }: AssetsListProps) {
  return (
    <ScrollView>
      <YStack space="$4">
        <Pressable>
          <Text fontSize="$6" fontWeight="600">
            Tokens
          </Text>
        </Pressable>

        {ownedAssets.map((asset, idx) => (
          <TokenRow
            key={idx}
            token={asset.tokenAddress}
            tokenName={asset.tokenName}
            withTrigger={withTrigger}
            onPress={() => onPress(asset)}
          />
        ))}
      </YStack>
    </ScrollView>
  );
}
