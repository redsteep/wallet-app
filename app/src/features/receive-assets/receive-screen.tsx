import { PanModal } from "@wallet/pan-modal";
import { ZeroAddress } from "ethers";
import { Text, Theme } from "tamagui";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { useSimpleAccount } from "~/lib/hooks/use-simple-account";

export function ReceiveScreen() {
  const account = useSimpleAccount();
  const accountAddress = account?.getSender() ?? ZeroAddress;

  return (
    <Theme name="dark">
      <PanModal.Content>
        <SafeAreaStack backgroundColor="black">
          <Text>WIP</Text>
        </SafeAreaStack>
      </PanModal.Content>
    </Theme>
  );
}
