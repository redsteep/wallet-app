import { AssetsList } from "~/features/assets/components/assets-list";
import { useTransferContext } from "~/features/transfer-assets/context";

export function ChooseAssetStep() {
  const { actions } = useTransferContext();
  return <AssetsList onPress={actions.setTransferAsset} />;
}
