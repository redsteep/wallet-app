import { Text, YStack } from "tamagui";

export function NoActivity() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$6" space="$2">
      <Text fontSize="$6" fontWeight="600" textAlign="center">
        No activity found for this wallet
      </Text>
      <Text color="$color10" fontSize="$6" fontWeight="500" textAlign="center">
        Your wallet activity (such as transactions) will appear here.
      </Text>
    </YStack>
  );
}
