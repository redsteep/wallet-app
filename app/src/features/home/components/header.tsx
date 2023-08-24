import { TouchableOpacity } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { useAccount } from "wagmi";
import { useWeb3Auth } from "~/lib/web3auth";
import { shortenAddress } from "~/utils/shorten-address";

export function Header() {
  const { address } = useAccount();
  const { logout } = useWeb3Auth((state) => state.actions);

  const formattedAddress = address ? shortenAddress(address) : "Loading...";

  return (
    <XStack justifyContent="space-between" alignItems="center">
      <YStack space="$2">
        <Text fontSize="$6">{formattedAddress}</Text>
        <Text fontSize="$10" fontWeight="600" letterSpacing={0.5} lineHeight={36.0}>
          $0.00
        </Text>
      </YStack>

      <TouchableOpacity onPress={logout}>
        <Text fontWeight="500">Logout</Text>
      </TouchableOpacity>
    </XStack>
  );
}
