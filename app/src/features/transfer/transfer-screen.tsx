import Ionicons from "@expo/vector-icons/Ionicons";
import { PanModal } from "@wallet/pan-modal";
import { useState } from "react";
import { Pressable } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Text, XStack } from "tamagui";
import { P, match } from "ts-pattern";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { ownedAssets } from "~/features/assets";
import { RecipientSelector } from "~/features/transfer/components/recipient-selector";
import { TransferContext } from "~/features/transfer/context";
import { ChooseAmountStep } from "~/features/transfer/steps/choose-amount";
import { ChooseAssetStep } from "~/features/transfer/steps/choose-asset";
import { ConfirmTransactionStep } from "~/features/transfer/steps/confirm-transaction";
import { type AppStackScreenProps } from "~/navigation/navigators/app-navigator";

export function TransferScreen({
  route: { params },
  navigation,
}: AppStackScreenProps<"Transfer">) {
  const initialAsset = ownedAssets.find(
    (asset) => asset.tokenAddress === params?.tokenAddress,
  );

  const [recipientAddress, setRecipientAddress] = useState(params?.recipientAddress);
  const [transferAsset, setTransferAsset] = useState(initialAsset);
  const [transferValue, setTransferValue] = useState(params?.value);

  return (
    <TransferContext.Provider
      value={{
        recipientAddress,
        transferAsset,
        transferValue,
        actions: {
          setRecipientAddress,
          setTransferAsset,
          setTransferValue,
        },
      }}
    >
      <PanModal.Content>
        <SafeAreaStack backgroundColor="$background" padding="$4" space="$4">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$8" fontWeight="700">
              Send
            </Text>

            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={28} />
            </Pressable>
          </XStack>

          <RecipientSelector />

          <Animated.View
            key={`${recipientAddress}${transferAsset}${transferValue}`}
            style={{ flex: 1 }}
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
            {match([recipientAddress, transferAsset, transferValue])
              .with([P.nullish, P.any, P.any], () => null)
              .with([P.any, P.nullish, P.any], () => <ChooseAssetStep />)
              .with([P.any, P.any, P.nullish], () => <ChooseAmountStep />)
              .otherwise(() => (
                <ConfirmTransactionStep />
              ))}
          </Animated.View>
        </SafeAreaStack>
      </PanModal.Content>
    </TransferContext.Provider>
  );
}
