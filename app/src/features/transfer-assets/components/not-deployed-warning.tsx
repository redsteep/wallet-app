import { SmartAccountProvider } from "@alchemy/aa-core";
import { StyleSheet } from "react-native";
import { useQuery } from "react-query";
import { Text, YStack } from "tamagui";
import { useAccount } from "wagmi";
import { IS_DEPLOYED } from "~/lib/query-keys";

export function NotDeployedWarning() {
  const { address, connector } = useAccount();

  const { data: isDeployed, isLoading: loadingDeployStatus } = useQuery(
    [IS_DEPLOYED, address],
    async () => {
      const provider = await connector?.getProvider();
      if (provider instanceof SmartAccountProvider) {
        return await provider.account?.isAccountDeployed();
      }
    },
    { enabled: Boolean(connector) },
  );

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
