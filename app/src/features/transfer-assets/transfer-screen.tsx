import Ionicons from "@expo/vector-icons/Ionicons";
import { PanModal } from "@wallet/pan-modal";
import { useState } from "react";
import { Pressable } from "react-native";
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
} from "react-native-reanimated";
import { Text, View, XStack } from "tamagui";
import { P, match } from "ts-pattern";
import { Address } from "viem";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { Asset } from "~/features/assets/assets";
import { RecipientSelector } from "~/features/transfer-assets/components/recipient-selector";
import { TransferContext } from "~/features/transfer-assets/context";
import { ChooseAmountStep } from "~/features/transfer-assets/steps/choose-amount";
import { ChooseAssetStep } from "~/features/transfer-assets/steps/choose-asset";
import { ConfirmTransactionStep } from "~/features/transfer-assets/steps/confirm-transaction";
import type { HomeStackScreenProps } from "~/navigation/navigators/home-navigator";

export function TransferScreen({ navigation, route }: HomeStackScreenProps<"Transfer">) {
  const [recipientAddress, setRecipientAddress] = useState<Address>();
  const [transferAsset, setTransferAsset] = useState<Asset>();
  const [transferValue, setTransferValue] = useState<bigint>();

  // const { presentationState } = usePanModalContext();

  // const { data: tokenData } = useToken({
  //   address: route.params?.tokenAddress,
  //   staleTime: Infinity,
  // });

  // const {
  //   data: approveData,
  //   isLoading: isApproveLoading,
  //   writeAsync: writeApproveAsync,
  // } = useContractWrite({
  //   abi: erc20ABI,
  //   address: "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B",
  //   functionName: "approve",
  // });

  // const {
  //   data: transferData,
  //   isLoading: isLoadingTransfer,
  //   writeAsync: writeTransferAsync,
  // } = useContractWrite({
  //   abi: erc20ABI,
  //   address: "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B",
  //   functionName: "transfer",
  // });

  // const recipient = watch("accountAddress");
  // const showPasteButton = !recipient || recipient.length <= 0;

  // const onSubmit = handleSubmit(
  //   async (values) => {
  //     const paymasterAddress = "0xE93ECa6595fe94091DC1af46aaC2A8b5D7990770";
  //     const transferValue = parseUnits(values.transferAmount, 6);

  //     await writeApproveAsync({ args: [paymasterAddress, transferValue * 3n] });
  //     await writeTransferAsync({ args: [values.accountAddress, transferValue] });
  //   },
  //   () => notificationAsync(NotificationFeedbackType.Error),
  // );

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
