import { Image } from "expo-image";
import { Text, YStack } from "tamagui";

interface DappButtonProps {
  title: string;
  href: string;
  onPress: () => void;
}

export function DappButton({ title, href, onPress }: DappButtonProps) {
  const faviconUrl = new URL("https://www.google.com/s2/favicons");
  faviconUrl.searchParams.append("domain", href);
  faviconUrl.searchParams.append("sz", "48");

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      paddingVertical="$3"
      space="$2.5"
      borderRadius="$8"
      hoverStyle={{ backgroundColor: "$backgroundHover" }}
      pressStyle={{ backgroundColor: "$backgroundPress" }}
      onPress={onPress}
    >
      <Image style={{ width: 48, height: 48 }} source={{ uri: faviconUrl.toString() }} />
      <Text fontSize="$4" fontWeight="500" adjustsFontSizeToFit>
        {title}
      </Text>
    </YStack>
  );
}
