import { Text, YStack } from "tamagui";
import { FadingScrollView } from "~/components/fading-scroll-view";
import { ownedAssets } from "~/features/assets";
import { TokenButton } from "~/features/token/components/token-button";
import { type TabScreenProps } from "~/navigation/navigators/app-navigator";

export function ActivityScreen({ navigation }: TabScreenProps<"Activity">) {
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
    </YStack>
  );
}
