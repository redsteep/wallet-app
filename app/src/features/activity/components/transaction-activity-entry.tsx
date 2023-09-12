import { Image } from "expo-image";
import Animated, { LinearTransition } from "react-native-reanimated";
import { Text, XStack, YStack } from "tamagui";
import { match } from "ts-pattern";
import { formatUnits, getAddress } from "viem";
import { useAccount, useToken } from "wagmi";
import type {
  CompletedTransaction,
  PendingTransaction,
} from "~/features/transactions/types";
import { commify } from "~/utils/commify";
import { shortenAddress } from "~/utils/shorten-address";

const AnimatedXStack = Animated.createAnimatedComponent(XStack);

interface TransactionActivityEntryProps {
  transaction: PendingTransaction | CompletedTransaction;
}

export function TransactionActivityEntry({ transaction }: TransactionActivityEntryProps) {
  const { address } = useAccount();

  const { data: token } = useToken({
    address: transaction.asset.tokenAddress,
  });

  const status = "status" in transaction ? transaction.status : "pending";

  const formattedUnits = parseFloat(
    formatUnits(transaction.value ?? 0n, token?.decimals ?? 18),
  ).toFixed(4);

  const formattedValue = `${commify(formattedUnits)} ${token?.symbol}`;

  return (
    <AnimatedXStack
      justifyContent="space-between"
      layout={LinearTransition.springify()
        .mass(0.15)
        .damping(8)
        .stiffness(60)
        .overshootClamping(1)}
    >
      <XStack alignItems="center" space="$2.5">
        <Image
          source={transaction.asset.tokenImage}
          style={{
            width: 50,
            height: 50,
            backgroundColor: "black",
            borderRadius: 100,
          }}
        />

        <YStack space="$1.5" justifyContent="center">
          <XStack space="$1.5" alignItems="center">
            <Text
              color={status !== "reverted" ? "$color10" : "$red11"}
              fontSize="$4"
              fontWeight="500"
              letterSpacing={0.25}
            >
              {match(status)
                .with("pending", () => `Sending to ${shortenAddress(transaction.to)}...`)
                .with("success", () => `Sent to ${shortenAddress(transaction.to)}`)
                .with("reverted", () => "Transaction Reverted")
                .exhaustive()}
            </Text>
          </XStack>

          <Text fontSize="$6" fontWeight="600">
            {transaction.asset.tokenName}
          </Text>
        </YStack>
      </XStack>

      <YStack justifyContent="center" alignItems="center">
        {getAddress(transaction.from) !== getAddress(address!) ? (
          <Text color="$green11" fontSize="$6" fontWeight="600" letterSpacing={0.25}>
            {formattedValue}
          </Text>
        ) : (
          <Text color="$red10" fontSize="$6" fontWeight="600" letterSpacing={0.25}>
            -{formattedValue}
          </Text>
        )}
      </YStack>
    </AnimatedXStack>
  );
}
