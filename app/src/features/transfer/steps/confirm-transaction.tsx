import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useFocusEffect,
  useNavigation,
  type NavigationProp,
} from "@react-navigation/native";
import { authenticateAsync } from "expo-local-authentication";
import { useMutation } from "react-query";
import { Button, Separator, Spinner, Text, Theme, XStack, YStack } from "tamagui";
import { encodeFunctionData, formatUnits } from "viem";
import { erc20ABI, useAccount, useBalance } from "wagmi";
import { useTransactions } from "~/features/transactions";
import { type TransactionRequest } from "~/features/transactions/types";
import { useTransferContext } from "~/features/transfer/context";
import { useUserPreferences } from "~/lib/user-preferences";
import { type AppStackParamList } from "~/navigation/navigators/app-navigator";
import { shortenAddress } from "~/utils/shorten-address";

class LocalAuthenticationError extends Error {}

export function ConfirmTransactionStep() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();

  const { address } = useAccount();
  const { hasEnabledBiometrics } = useUserPreferences();
  const { sendTransaction } = useTransactions((state) => state.actions);
  const { recipientAddress, transferAsset, transferValue, actions } =
    useTransferContext();

  const { data: tokenBalance } = useBalance({
    address,
    token: transferAsset?.tokenAddress,
    watch: true,
  });

  const { isSuccess, isLoading, mutate } = useMutation(
    async () => {
      if (!address || !recipientAddress || !transferAsset || !transferValue) {
        return;
      }

      if (hasEnabledBiometrics) {
        const { success } = await authenticateAsync({ disableDeviceFallback: true });
        if (!success) {
          throw new LocalAuthenticationError("Local authentication failed");
        }
      }

      const transactionRequest: TransactionRequest = {
        from: address,
        to: recipientAddress,
        asset: transferAsset,
        value: transferValue,
      };

      if (transferAsset.type === "erc20") {
        transactionRequest.data = encodeFunctionData({
          abi: erc20ABI,
          functionName: "transfer",
          args: [recipientAddress, transferValue],
        });
      }

      sendTransaction(transactionRequest);
    },
    {
      onSettled(_, error) {
        if (error instanceof LocalAuthenticationError) {
          return;
        }
        navigation.goBack();
      },
    },
  );

  useFocusEffect(() => () => {
    if (isSuccess) {
      requestAnimationFrame(() => navigation.navigate("Tabs", { screen: "Activity" }));
    }
  });

  const hasEnoughBalance = (tokenBalance?.value ?? 0n) >= (transferValue ?? 0n);
  const canConfirmTransaction = hasEnoughBalance && !isLoading;

  return (
    <YStack flex={1} justifyContent="space-between" space="$4">
      <YStack flex={1} justifyContent="center" space="$8">
        <YStack space="$2">
          <Ionicons name="paper-plane" size={28} />
          <Text fontSize="$8" fontWeight="700">
            Confirm transaction to{"\n"}
            {shortenAddress(recipientAddress!)}
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
          opacity={canConfirmTransaction ? 1.0 : 0.75}
          disabled={!canConfirmTransaction}
        >
          {isLoading && (
            <Button.Icon>
              <Spinner />
            </Button.Icon>
          )}
          <Button.Text fontSize="$6" fontWeight="600">
            {hasEnoughBalance ? "Confirm Transaction" : "Not Enough Balance"}
          </Button.Text>
        </Button>
      </Theme>
    </YStack>
  );
}
