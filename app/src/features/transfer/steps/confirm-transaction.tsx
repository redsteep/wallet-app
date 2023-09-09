import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useToastController } from "@tamagui/toast";
import { NotificationFeedbackType, notificationAsync } from "expo-haptics";
import { authenticateAsync } from "expo-local-authentication";
import { useMutation } from "react-query";
import { Button, Separator, Spinner, Text, Theme, XStack, YStack } from "tamagui";
import { formatUnits } from "viem";
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractWrite,
  useSendTransaction,
} from "wagmi";
import { useTransferContext } from "~/features/transfer/context";
import { useUserPreferences } from "~/lib/user-preferences";
import { shortenAddress } from "~/utils/shorten-address";

class LocalAuthenticationError extends Error {}

export function ConfirmTransactionStep() {
  const navigation = useNavigation();
  const toast = useToastController();

  const { address } = useAccount();
  const { hasEnabledBiometrics } = useUserPreferences();
  const { recipientAddress, transferAsset, transferValue, actions } =
    useTransferContext();

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

  const { isLoading, mutate } = useMutation(
    async () => {
      if (!recipientAddress || !transferAsset || !transferValue) {
        return;
      }

      if (hasEnabledBiometrics) {
        const { success } = await authenticateAsync({ disableDeviceFallback: true });
        if (!success) {
          throw new LocalAuthenticationError();
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
      onSettled(_, error) {
        notificationAsync(
          error ? NotificationFeedbackType.Error : NotificationFeedbackType.Success,
        );

        if (error instanceof LocalAuthenticationError) {
          return;
        }

        toast.show(error ? "Transaction Failed" : "Transaction Complete", {
          burntOptions: {
            preset: error ? "error" : "done",
          },
        });

        navigation.goBack();
      },
    },
  );

  return (
    <YStack flex={1} justifyContent="space-between" space="$4">
      <YStack flex={1} justifyContent="center" space="$8">
        <YStack space="$2">
          <Ionicons name="paper-plane" size={28} />
          <Text fontSize="$8" fontWeight="700">
            Confirm transaction to {`\n${shortenAddress(recipientAddress!)}`}
          </Text>
        </YStack>

        <YStack space="$3">
          {/* <XStack
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            space="$2.5"
          >
            <Text color="$color10" fontSize="$6" fontWeight="500">
              From
            </Text>

            <Separator />

            <Text paddingVertical="$2" fontSize="$6" fontWeight="500">
              {shortenAddress(address!)}
            </Text>
          </XStack> */}

          <XStack
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            space="$3"
          >
            <Text color="$color10" fontSize="$6" fontWeight="500">
              To
            </Text>

            <Separator />

            <Button
              onPress={() => actions.setRecipientAddress()}
              hoverStyle={{ backgroundColor: "$backgroundHover" }}
              pressStyle={{ backgroundColor: "$backgroundPress" }}
              flexDirection="row"
              alignItems="center"
              paddingVertical="$2"
              paddingHorizontal="$3"
              backgroundColor="$background"
              borderRadius="$8"
              overflow="hidden"
              unstyled
            >
              <Text fontSize="$6" fontWeight="500">
                {shortenAddress(recipientAddress!)}
              </Text>
              <Ionicons name="create-outline" size={18} />
            </Button>
          </XStack>

          <XStack
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            space="$3"
          >
            <Text color="$color10" fontSize="$6" fontWeight="500">
              Asset
            </Text>

            <Separator />

            <Button
              onPress={() => {
                actions.setTransferAsset();
                actions.setTransferValue();
              }}
              hoverStyle={{ backgroundColor: "$backgroundHover" }}
              pressStyle={{ backgroundColor: "$backgroundPress" }}
              flexDirection="row"
              alignItems="center"
              paddingVertical="$2"
              paddingHorizontal="$3"
              backgroundColor="$background"
              borderRadius="$8"
              overflow="hidden"
              unstyled
            >
              <Text fontSize="$6" fontWeight="500">
                {transferAsset?.tokenName}
              </Text>
              <Ionicons name="create-outline" size={18} />
            </Button>
          </XStack>

          <XStack
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            space="$3"
          >
            <Text color="$color10" fontSize="$6" fontWeight="500">
              Value
            </Text>

            <Separator />

            <Button
              onPress={() => actions.setTransferValue()}
              hoverStyle={{ backgroundColor: "$backgroundHover" }}
              pressStyle={{ backgroundColor: "$backgroundPress" }}
              flexDirection="row"
              alignItems="center"
              paddingVertical="$2"
              paddingHorizontal="$3"
              backgroundColor="$background"
              borderRadius="$8"
              overflow="hidden"
              unstyled
            >
              <Text fontSize="$6" fontWeight="500">
                {formatUnits(transferValue!, tokenBalance?.decimals ?? 18)}{" "}
                {tokenBalance?.symbol}
              </Text>
              <Ionicons name="create-outline" size={18} />
            </Button>
          </XStack>
        </YStack>
      </YStack>

      <Theme name="dark">
        <Button
          size="$5"
          onPress={() => mutate()}
          opacity={!isLoading ? 1.0 : 0.75}
          disabled={isLoading}
        >
          {isLoading && (
            <Button.Icon>
              <Spinner />
            </Button.Icon>
          )}
          <Button.Text fontSize="$6" fontWeight="600">
            Confirm Transaction
          </Button.Text>
        </Button>
      </Theme>
    </YStack>
  );
}
