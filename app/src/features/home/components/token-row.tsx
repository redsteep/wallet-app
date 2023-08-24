import { PanModal } from "@wallet/pan-modal";
import * as dnum from "dnum";
import { Stack, Text, XStack, YStack } from "tamagui";
import type { Address } from "viem";
import { useAccount, useBalance } from "wagmi";

interface TokenRowProps {
  token?: Address;
  tokenName: string;
}

export function TokenRow({ token, tokenName }: TokenRowProps) {
  const { address } = useAccount();
  const { data } = useBalance({ address, token, watch: true });

  const formattedBalance = dnum.format([data?.value ?? 0n, data?.decimals ?? 18], {
    digits: 4,
  });

  return (
    <PanModal.Trigger
      destination={{ name: "Transfer", params: { tokenAddress: token } }}
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
