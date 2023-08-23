import { Stack, Text, XStack, YStack } from "tamagui";
import type { Address } from "viem";
import { useBalance } from "wagmi";
import * as dnum from "dnum";
import { PanModal } from "@wallet/pan-modal";
import { useMemo } from "react";

interface TokenRowProps {
  accountAddress?: Address;
  tokenAddress?: Address;
  tokenName: string;
}

export function TokenRow({ accountAddress, tokenAddress, tokenName }: TokenRowProps) {
  const { data } = useBalance({
    address: accountAddress,
    token: tokenAddress,
    watch: true,
  });

  const formattedBalance = useMemo(
    () => dnum.format([data?.value ?? 0n, data?.decimals ?? 18], { digits: 4 }),
    [data],
  );

  return (
    <PanModal.Trigger
      destination={{ name: "Transfer", params: { tokenAddress } }}
      style={{ borderRadius: 16, overflow: "hidden" }}
    >
      <XStack alignItems="center" space="$2.5">
        <Stack width="$3.5" height="$3.5" borderRadius="$10" backgroundColor="black" />

        <YStack space="$1">
          <Text fontWeight="500">{tokenName}</Text>
          <Text color="$gray10">
            {data ? `${formattedBalance} ${data.symbol}` : "Loading..."}
          </Text>
        </YStack>
      </XStack>
    </PanModal.Trigger>
  );
}
