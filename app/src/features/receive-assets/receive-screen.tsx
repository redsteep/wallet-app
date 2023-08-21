import { PanModal } from "@wallet/pan-modal";
import { Text, Theme } from "tamagui";
import { SafeAreaStack } from "~/components/safe-area-stack";

export function ReceiveScreen() {
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
