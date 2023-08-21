import { Stack, Text, XStack, YStack } from "tamagui";
import type { Hex } from "viem";
import { useBalance } from "wagmi";
import * as dnum from "dnum";

interface TokenRowProps {
  accountAddress?: Hex;
  tokenName: string;
}

export function TokenRow({ accountAddress, tokenName }: TokenRowProps) {
  const { data } = useBalance({ address: accountAddress });
  const formattedBalance = dnum.format([data?.value ?? 0n, 18], { digits: 4 });

  return (
    <XStack alignItems="center" space="$2.5">
      <Stack width="$3.5" height="$3.5" borderRadius="$10" backgroundColor="black" />

      <YStack space="$1">
        <Text fontWeight="500">{tokenName}</Text>
        <Text color="$gray10">
          {data ? `${formattedBalance} ${data.symbol}` : "Loading..."}
        </Text>
      </YStack>
    </XStack>
  );
}
