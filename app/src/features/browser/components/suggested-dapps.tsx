import { Text, XStack, YStack } from "tamagui";
import { DappButton } from "~/features/browser/components/suggested-dapp-button";

const suggestedDapps = [
  {
    title: "Mirror",
    href: "https://mirror.xyz",
  },
  {
    title: "Uniswap",
    href: "https://app.uniswap.org",
  },
  {
    title: "OpenSea",
    href: "https://opensea.io",
  },
  {
    title: "Rarible",
    href: "https://rarible.com",
  },
];

interface SuggestedDappsProps {
  onNavigate: (url: URL) => void;
}

export function SuggestedDapps({ onNavigate }: SuggestedDappsProps) {
  return (
    <YStack marginVertical="$3" marginHorizontal="$4" space="$4">
      <Text fontSize="$6" fontWeight="600">
        Suggested
      </Text>

      <XStack space="$3">
        {suggestedDapps.map((dappInfo, idx) => (
          <DappButton
            key={idx}
            title={dappInfo.title}
            href={dappInfo.href}
            onPress={() => {
              onNavigate(new URL(dappInfo.href));
            }}
          />
        ))}
      </XStack>
    </YStack>
  );
}
