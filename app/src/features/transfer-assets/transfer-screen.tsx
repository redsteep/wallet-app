import { zodResolver } from "@hookform/resolvers/zod";
import { PanModal } from "@wallet/pan-modal";
import { ZeroAddress, isAddress, parseEther } from "ethers";
import { NotificationFeedbackType, notificationAsync } from "expo-haptics";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { useMutation, useQueryClient } from "react-query";
import { Button, Input, Spinner, Text, Theme, XStack, YStack } from "tamagui";
import { z } from "zod";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { NotDeployedWarning } from "~/features/transfer-assets/components/not-deployed-warning";
import { useSimpleAccount } from "~/lib/hooks/use-simple-account";
import { sendAndWaitUserOperation } from "~/lib/operations/send-user-operation";
import { ACCOUNT_BALANCE, IS_DEPLOYED } from "~/lib/query-keys";

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

type SchemaType = z.infer<typeof schema>;

export function TransferScreen() {
  const queryClient = useQueryClient();
  const simpleAccount = useSimpleAccount();
  const accountAddress = simpleAccount?.getSender() ?? ZeroAddress;

  const { formState, handleSubmit, control } = useForm<z.infer<typeof schema>>({
    mode: "all",
    resolver: zodResolver(schema),
  });

  // SimpleAccount#getInitCode() doesn't return valid init code,
  // resorting to accessing "private" class field
  // const { data: estimatedCreationGas } = useEstimateCreationGass(simpleAccount?.initCode);

  const {
    data,
    isLoading,
    mutate: sendUserOperation,
  } = useMutation(
    async ({ accountAddress, transferAmount }: SchemaType) => {
      const parsedTransferAmount = parseEther(String(transferAmount));
      const userOp = simpleAccount!.execute(accountAddress, parsedTransferAmount, "0x");
      return await sendAndWaitUserOperation(userOp);
    },
    {
      onSettled() {
        queryClient.invalidateQueries([ACCOUNT_BALANCE]);
        queryClient.invalidateQueries([IS_DEPLOYED]);
      },
    },
  );

  const onSubmit = handleSubmit(
    (values) => {
      console.log(values);
      sendUserOperation(values);
    },
    () => notificationAsync(NotificationFeedbackType.Error),
  );

  return (
    <PanModal.Content>
      <Theme name="dark">
        <SafeAreaStack
          justifyContent="space-between"
          backgroundColor="black"
          paddingHorizontal="$4"
        >
          <XStack height="$5" alignItems="center">
            <Text fontSize="$8" fontWeight="700">
              Transfer
            </Text>
          </XStack>

          {data && (
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
                Success!
              </Text>

              <Text fontSize="$4" color="white">
                Transaction Hash: {data.transactionHash}
              </Text>
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
                  placeholder="ETH amount"
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
              {isLoading && (
                <Button.Icon scaleIcon={1.25}>
                  <Spinner />
                </Button.Icon>
              )}
              <Button.Text fontWeight="600">Transfer</Button.Text>
            </Button>
          </YStack>

          <YStack paddingVertical="$4">
            <NotDeployedWarning accountAddress={accountAddress} />
          </YStack>
        </SafeAreaStack>
      </Theme>
    </PanModal.Content>
  );
}
