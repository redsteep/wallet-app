import { Image } from "expo-image";
import { Text, YStack } from "tamagui";

interface DappButtonProps {
  title: string;
  href: string;
  onPress: () => void;
}

export function DappButton({ title, href, onPress }: DappButtonProps) {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$3"
      space="$2"
      backgroundColor="$background"
      borderRadius="$8"
      hoverStyle={{ backgroundColor: "$backgroundHover" }}
      pressStyle={{ backgroundColor: "$backgroundPress" }}
      onPress={onPress}
    >
      <Image style={{ width: 48, height: 48 }} source={{ uri: getFaviconUrl(href) }} />
      <Text fontSize="$4" fontWeight="600">
        {title}
      </Text>
    </YStack>
  );
}

function getFaviconUrl(href: string) {
  const url = new URL("https://www.google.com/s2/favicons");
  url.searchParams.append("domain", href);
  url.searchParams.append("sz", "48");
  return url.toString();
}
