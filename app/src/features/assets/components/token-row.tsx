import { PanModal } from "@wallet/pan-modal";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Stack, Text, XStack, YStack } from "tamagui";
import type { Address } from "viem";
import { useAccount, useBalance } from "wagmi";

interface TokenRowProps {
  token?: Address;
  tokenName: string;
  withTrigger?: boolean;
  withPreciseFormatting?: boolean;
  onPress?: () => void;
}

export function TokenRow({
  token,
  tokenName,
  withTrigger,
  withPreciseFormatting,
  onPress,
}: TokenRowProps) {
  const { address } = useAccount();
  const { data } = useBalance({ address, token, watch: true });

  const formattedBalance = !withPreciseFormatting
    ? Number(data?.formatted).toFixed(4)
    : data?.formatted;

  const children = (
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
  );

  return withTrigger ? (
    <PanModal.Trigger onTriggerPress={onPress}>{children}</PanModal.Trigger>
  ) : (
    <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
  );
}
