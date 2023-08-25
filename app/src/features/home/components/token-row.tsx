import { PanModal } from "@wallet/pan-modal";
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

  const formattedBalance = Number(data?.formatted).toFixed(4);

  return (
    <PanModal.Trigger destination={{ name: "Transfer", params: { tokenAddress: token } }}>
      <XStack justifyContent="space-between">
        <XStack alignItems="center" space="$2.5">
          <Stack width="$4.5" height="$4.5" borderRadius="$10" backgroundColor="$color" />

          <YStack space="$1.5">
            <Text fontSize="$6" fontWeight="600">
              {tokenName}
            </Text>

            <Text color="$color10">
              {data ? `${formattedBalance} ${data.symbol}` : "Loading..."}
            </Text>
          </YStack>
        </XStack>

        <YStack justifyContent="center" alignItems="flex-end" space="$1">
          <Text fontSize="$6" fontWeight="500">
            $0.00
          </Text>
          <Text color="$color10">+1.0%</Text>
        </YStack>
      </XStack>
    </PanModal.Trigger>
  );
}
