import type { LOGIN_PROVIDER } from "@web3auth/react-native-sdk";
import { useMutation } from "react-query";
import { Button, Spinner } from "tamagui";
import { useWeb3Auth } from "~/lib/web3auth";

interface LoginButtonProps {
  providerKey: Lowercase<keyof typeof LOGIN_PROVIDER>;
}

function capitalizeFirstLetter(string: string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export function LoginButton({ providerKey }: LoginButtonProps) {
  const { loginWith } = useWeb3Auth((state) => state.actions);

  const { isLoading, mutate } = useMutation(`w3a-${providerKey}`, () =>
    loginWith(providerKey.toUpperCase()),
  );

  return (
    <Button size="$3.5" disabled={isLoading} onPress={() => mutate()}>
      {isLoading && (
        <Button.Icon scaleIcon={1.25}>
          <Spinner />
        </Button.Icon>
      )}
      <Button.Text fontWeight="600">
        Login with {capitalizeFirstLetter(providerKey)}
      </Button.Text>
    </Button>
  );
}
