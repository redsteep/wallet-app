import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, XStack, YStack } from "tamagui";
import { FadingScrollView } from "~/components/fading-scroll-view";
import { ownedAssets } from "~/features/assets";
import { ActionButton } from "~/features/assets/components/action-button";
import { TokenButton } from "~/features/token/components/token-button";
import { type TabScreenProps } from "~/navigation/navigators/app-navigator";

export function AssetsScreen({ navigation }: TabScreenProps<"Assets">) {
  return (
    <YStack flex={1} backgroundColor="$backgroundStrong" padding="$4" space="$4">
      <FadingScrollView>
        <YStack space="$4">
          <Text fontSize="$6" fontWeight="600">
            Tokens
          </Text>

          {ownedAssets.map((token, idx) => (
            <TokenButton
              key={idx}
              token={token}
              onPress={() => navigation.navigate("Token", { token })}
              wrapWithPanTrigger
              trimBalanceDecimals
              showFiatPrice
            />
          ))}
        </YStack>
      </FadingScrollView>

      <XStack alignItems="center" justifyContent="space-between" space="$3">
        <ActionButton onPress={() => navigation.navigate("Receive")}>
          <ActionButton.Icon backgroundColor="#49CF57">
            <Ionicons name="arrow-down" color="white" size={24} />
          </ActionButton.Icon>
          <ActionButton.Text>Receive</ActionButton.Text>
        </ActionButton>

        <ActionButton onPress={() => navigation.navigate("Transfer")}>
          <ActionButton.Icon backgroundColor="#119BFF">
            <Ionicons name="arrow-up" color="white" size={24} />
          </ActionButton.Icon>
          <ActionButton.Text>Send</ActionButton.Text>
        </ActionButton>

        <ActionButton onPress={() => navigation.navigate("Transfer")}>
          <ActionButton.Icon backgroundColor="#B3B3B3">
            <Ionicons name="swap-vertical" color="white" size={24} />
          </ActionButton.Icon>
          <ActionButton.Text>Swap</ActionButton.Text>
        </ActionButton>
      </XStack>
    </YStack>
  );
}
