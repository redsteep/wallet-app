import { Text, YStack } from "tamagui";
import { ownedAssets, type Asset } from "~/features/assets/assets";
import { TokenRow } from "~/features/assets/components/token-row";

interface AssetsListProps {
  asTrigger?: boolean;
  onPress: (asset: Asset) => void;
}

export function AssetsList({ asTrigger = false, onPress }: AssetsListProps) {
  return (
    <YStack space="$4">
      <Text fontSize="$6" fontWeight="600">
        Tokens
      </Text>

      {ownedAssets.map((asset, idx) => (
        <TokenRow
          key={idx}
          asset={asset}
          asTrigger={asTrigger}
          onPress={() => onPress(asset)}
        />
      ))}
    </YStack>
  );
}
