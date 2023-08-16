import { FixedNumber, formatEther } from "ethers";
import { useMemo } from "react";
import { Stack, Text, XStack, YStack } from "tamagui";
import { useAccountBalance } from "~/lib/hooks/use-account-balance";

interface TokenRowProps {
  accountAddress: string;
  tokenName: string;
}

export function TokenRow({ accountAddress, tokenName }: TokenRowProps) {
  const { data, isLoading } = useAccountBalance(accountAddress);
  const accountBalance = data ?? 0n;

  const formattedEther = useMemo(
    () => FixedNumber.fromString(formatEther(accountBalance)).round(4).toString(),
    [accountBalance],
  );

  return (
    <XStack alignItems="center" space="$2.5">
      <Stack width="$3.5" height="$3.5" borderRadius="$10" backgroundColor="black" />

      <YStack space="$1">
        <Text fontWeight="500">{tokenName}</Text>
        <Text color="$gray10">{!isLoading ? `${formattedEther} ETH` : "Loading..."}</Text>
      </YStack>
    </XStack>
  );
}
