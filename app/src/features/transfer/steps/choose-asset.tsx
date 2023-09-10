import { Text, YStack, useTheme } from "tamagui";
import { FadingScrollView } from "~/components/fading-scroll-view";
import { ownedAssets } from "~/features/assets";
import { TokenButton } from "~/features/token/components/token-button";
import { useTransferContext } from "~/features/transfer/context";

export function ChooseAssetStep() {
  const { background, backgroundTransparent } = useTheme();
  const { actions } = useTransferContext();

  return (
    <FadingScrollView gradientColors={[background.get(), backgroundTransparent.get()]}>
      <YStack space="$4">
        <Text fontSize="$6" fontWeight="600">
          Tokens
        </Text>

        {ownedAssets.map((token, idx) => (
          <TokenButton
            key={idx}
            token={token}
            onPress={() => actions.setTransferAsset(token)}
            trimBalanceDecimals
            showFiatPrice
          />
        ))}
      </YStack>
    </FadingScrollView>
  );
}
