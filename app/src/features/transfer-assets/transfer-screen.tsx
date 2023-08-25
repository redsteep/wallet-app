import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { PanModal } from "@wallet/pan-modal";
import { NotificationFeedbackType, notificationAsync } from "expo-haptics";
import { Controller, useForm } from "react-hook-form";
import { Linking, Pressable, StyleSheet } from "react-native";
import { Button, Input, Spinner, Text, XStack, YStack } from "tamagui";
import { isAddress, parseEther, parseUnits } from "viem";
import { erc20ABI, useContractWrite, useToken } from "wagmi";
import { z } from "zod";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { NotDeployedWarning } from "~/features/transfer-assets/components/not-deployed-warning";
import type { HomeStackScreenProps } from "~/navigation/navigators/home-navigator";

const schema = z.object({
  accountAddress: z.string().refine(isAddress),
  transferAmount: z.string().refine((value) => {
    try {
      parseEther(value);
      return true;
    } catch {
      return false;
    }
  }),
});

// TODO: Clean this up and introduce transaction batching + bring back ETH transfers
export function TransferScreen({ route }: HomeStackScreenProps<"Transfer">) {
  const navigation = useNavigation();

  const { data: tokenData } = useToken({
    address: route.params?.tokenAddress,
    staleTime: Infinity,
  });

  const {
    data: approveData,
    isLoading: isApproveLoading,
    writeAsync: writeApproveAsync,
  } = useContractWrite({
    abi: erc20ABI,
    address: "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B",
    functionName: "approve",
  });

  const {
    data: transferData,
    isLoading: isLoadingTransfer,
    writeAsync: writeTransferAsync,
  } = useContractWrite({
    abi: erc20ABI,
    address: "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B",
    functionName: "transfer",
  });

  const { formState, handleSubmit, control } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const onSubmit = handleSubmit(
    async (values) => {
      const paymasterAddress = "0xE93ECa6595fe94091DC1af46aaC2A8b5D7990770";
      const transferValue = parseUnits(values.transferAmount, 6);

      await writeApproveAsync({ args: [paymasterAddress, transferValue * 3n] });
      await writeTransferAsync({ args: [values.accountAddress, transferValue] });
    },
    () => notificationAsync(NotificationFeedbackType.Error),
  );

  return (
    <PanModal.Content>
      <SafeAreaStack
        justifyContent="space-between"
        backgroundColor="$background"
        paddingHorizontal="$4"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$8" fontWeight="700">
            Send
          </Text>

          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} />
          </Pressable>
        </XStack>

        {transferData?.hash && (
          <YStack
            paddingVertical="$3"
            paddingHorizontal="$3"
            backgroundColor="$green2"
            borderWidth={StyleSheet.hairlineWidth}
            borderColor="$green6"
            borderRadius="$6"
            space="$2"
          >
            <Text color="$green10" fontSize="$6" fontWeight="600">
              Successful Transaction
            </Text>
            <Pressable
              onPress={() =>
                Linking.openURL(`https://sepolia.etherscan.io/tx/${transferData.hash}`)
              }
            >
              <Text fontSize="$4" color="$green8">
                Hash: {transferData.hash}
              </Text>
            </Pressable>
          </YStack>
        )}

        <YStack space="$2">
          <Controller
            control={control}
            name="accountAddress"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                size="$5"
                theme={formState.errors.accountAddress ? "red" : "dark"}
                placeholder="Address"
                inputMode="text"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="transferAmount"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                size="$5"
                theme={formState.errors.transferAmount ? "red" : "dark"}
                placeholder={`${tokenData?.symbol ?? "ETH"} amount`}
                inputMode="decimal"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Button
            size="$5"
            opacity={formState.isValid ? 1.0 : 0.75}
            disabled={!formState.isValid}
            onPress={onSubmit}
          >
            {(isApproveLoading || isLoadingTransfer) && (
              <Button.Icon scaleIcon={1.25}>
                <Spinner />
              </Button.Icon>
            )}
            <Button.Text fontWeight="600">Transfer</Button.Text>
          </Button>
        </YStack>

        <YStack paddingVertical="$4">
          <NotDeployedWarning />
        </YStack>
      </SafeAreaStack>
    </PanModal.Content>
  );
}
