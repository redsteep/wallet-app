import { useTheme } from "tamagui";
import { FadingScrollView } from "~/components/fading-scroll-view";
import { AssetsList } from "~/features/assets/components/assets-list";
import { useTransferContext } from "~/features/transfer-assets/context";

export function ChooseAssetStep() {
  const { background, backgroundTransparent } = useTheme();
  const { actions } = useTransferContext();

  return (
    <FadingScrollView gradientColors={[background.get(), backgroundTransparent.get()]}>
      <AssetsList onPress={actions.setTransferAsset} />
    </FadingScrollView>
  );
}
