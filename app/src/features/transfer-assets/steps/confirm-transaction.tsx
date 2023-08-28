import {
  ImpactFeedbackStyle,
  NotificationFeedbackType,
  impactAsync,
  notificationAsync,
} from "expo-haptics";
import { useState } from "react";
import { Button, Spinner, Text, Theme, View, XStack, YStack } from "tamagui";
import { P, match } from "ts-pattern";
import { formatUnits, parseUnits } from "viem";
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractWrite,
  useSendTransaction,
} from "wagmi";
import { TokenRow } from "~/features/assets/components/token-row";
import { useTransferContext } from "~/features/transfer-assets/context";
import { shortenAddress } from "~/utils/shorten-address";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUserPreferences } from "~/lib/user-preferences";
import { useMutation } from "react-query";
import {
  AuthenticationType,
  authenticateAsync,
  supportedAuthenticationTypesAsync,
} from "expo-local-authentication";
import { useNavigation } from "@react-navigation/native";

export function ConfirmTransactionStep() {
  const navigation = useNavigation();

  const { address } = useAccount();
  const { hasEnabledBiometrics } = useUserPreferences();
  const { recipientAddress, transferAsset, transferValue } = useTransferContext();

  const { data: tokenBalance } = useBalance({
    address,
    token: transferAsset?.tokenAddress,
    watch: true,
  });

  // NOTE: used for native token (ETH) transfers
  const { sendTransactionAsync } = useSendTransaction();

  // NOTE: erc-20 transfers (approval for paymasters)
  const { writeAsync: writeApproveAsync } = useContractWrite({
    abi: erc20ABI,
    address: transferAsset?.tokenAddress,
    functionName: "approve",
  });

  // NOTE: erc-20 transfers
  const { writeAsync: writeTransferAsync } = useContractWrite({
    abi: erc20ABI,
    address: transferAsset?.tokenAddress,
    functionName: "transfer",
  });

  const {
    data: txData,
    isLoading,
    mutate,
  } = useMutation(
    async () => {
      if (!recipientAddress || !transferAsset || !transferValue) {
        return;
      }

      if (hasEnabledBiometrics) {
        const authStatus = await authenticateAsync({ disableDeviceFallback: false });
        if (!authStatus.success) {
          throw new Error("Failed biometric auth");
        }
      }

      // TODO:
      // - remove hardcoded address (pm_getAccounts)
      // - add user op batching
      // - better handle various assets
      // - way too much hooks, optimize

      if (transferAsset.tokenAddress) {
        const paymasterAddress = "0xE93ECa6595fe94091DC1af46aaC2A8b5D7990770";
        await writeApproveAsync({ args: [paymasterAddress, transferValue * 3n] });

        const result = await writeTransferAsync({
          args: [recipientAddress, transferValue],
        });
        return result.hash;
      } else {
        const result = await sendTransactionAsync({
          to: recipientAddress,
          value: transferValue,
        });
        return result.hash;
      }
    },
    {
      onSuccess() {
        navigation.goBack();
      },
      onError() {
        notificationAsync(NotificationFeedbackType.Error);
      },
    },
  );

  return (
    <YStack flex={1} justifyContent="space-between">
      <YStack flex={1} paddingVertical="$8" space="$8">
        <YStack space="$2">
          <Ionicons name="paper-plane" size={28} />
          <Text fontSize="$8" fontWeight="700">
            Confirm transaction to {`\n${shortenAddress(recipientAddress!)}`}
          </Text>
        </YStack>

        <YStack space="$4">
          <XStack width="100%" justifyContent="space-between">
            <Text color="$color10" fontSize="$6" fontWeight="600">
              Value
            </Text>
            <Text fontSize="$6" fontWeight="600">
              {formatUnits(transferValue!, tokenBalance?.decimals ?? 18)}{" "}
              {tokenBalance?.symbol}
            </Text>
          </XStack>
        </YStack>
      </YStack>

      <Theme name="dark">
        <Button
          size="$4"
          onPress={() => mutate()}
          opacity={!isLoading ? 1.0 : 0.75}
          disabled={isLoading}
        >
          {isLoading && (
            <Button.Icon>
              <Spinner />
            </Button.Icon>
          )}
          <Button.Text fontSize="$6" fontWeight="500">
            Confirm Transaction
          </Button.Text>
        </Button>
      </Theme>
    </YStack>
  );
}
