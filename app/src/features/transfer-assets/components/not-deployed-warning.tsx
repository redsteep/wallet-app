import { StyleSheet } from "react-native";
import { Text, YStack } from "tamagui";
import { useIsDeployed } from "~/features/transfer-assets/hooks/use-is-deployed";

interface NotDeployedWarningProps {
  accountAddress: string;
}

export function NotDeployedWarning({ accountAddress }: NotDeployedWarningProps) {
  const { data: isDeployed, isLoading: loadingDeployStatus } =
    useIsDeployed(accountAddress);

  if (loadingDeployStatus || isDeployed) {
    return null;
  }

  return (
    <YStack
      paddingVertical="$3"
      paddingHorizontal="$3"
      backgroundColor="$red2"
      borderWidth={StyleSheet.hairlineWidth}
      borderColor="$red10"
      borderRadius="$6"
      space="$2"
    >
      <Text color="$red10" fontSize="$5" fontWeight="600">
        Contract for this account is not deployed
      </Text>

      <Text fontSize="$4" color="white">
        Gas price for your first Ethereum transaction will be ~50% higher than usual to
        account for contract deployment fees.
      </Text>
    </YStack>
  );
}
