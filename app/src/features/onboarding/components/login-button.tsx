import Ionicons from "@expo/vector-icons/Ionicons";
import type { LOGIN_PROVIDER } from "@web3auth/react-native-sdk";
import { useMutation } from "react-query";
import { Button, Spinner } from "tamagui";
import { useWeb3Auth } from "~/lib/web3auth";

interface LoginButtonProps {
  providerKey: Lowercase<keyof typeof LOGIN_PROVIDER>;
  providerName: string;
  providerIcon: keyof typeof Ionicons.glyphMap;
}

export function LoginButton({
  providerKey,
  providerName,
  providerIcon,
}: LoginButtonProps) {
  const { loginWith } = useWeb3Auth((state) => state.actions);

  const { isLoading, mutate } = useMutation(`w3a-${providerKey}`, () =>
    loginWith(providerKey.toUpperCase() as never),
  );

  return (
    <Button size="$5" disabled={isLoading} onPress={() => mutate()}>
      <Button.Icon>
        {isLoading ? <Spinner /> : <Ionicons name={providerIcon} size={18} />}
      </Button.Icon>
      <Button.Text fontSize="$6" fontWeight="500">
        Login with {providerName}
      </Button.Text>
    </Button>
  );
}
