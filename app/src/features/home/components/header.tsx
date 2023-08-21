import { TouchableOpacity } from "react-native";
import { Text, XStack } from "tamagui";
import { useWeb3Auth } from "~/lib/web3auth";
import { shortenAddress } from "~/utils/shorten-address";

interface HeaderProps {
  accountAddress?: string;
}

export function Header({ accountAddress }: HeaderProps) {
  const { logout } = useWeb3Auth((state) => state.actions);

  return (
    <XStack height="$5" justifyContent="space-between" alignItems="center">
      <Text fontSize="$8" fontWeight="700">
        {accountAddress ? shortenAddress(accountAddress) : "Loading..."}
      </Text>

      <TouchableOpacity onPress={logout}>
        <Text fontWeight="500">Logout</Text>
      </TouchableOpacity>
    </XStack>
  );
}
