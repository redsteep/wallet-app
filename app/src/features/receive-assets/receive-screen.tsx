import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useToastController } from "@tamagui/toast";
import { PanModal } from "@wallet/pan-modal";
import * as Clipboard from "expo-clipboard";
import { Dimensions, Pressable, Share, TouchableOpacity } from "react-native";
import { Button, Text, Theme, XStack, YStack } from "tamagui";
import { useAccount } from "wagmi";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { QrCode } from "~/features/receive-assets/components/qr-code";
import { shortenAddress } from "~/utils/shorten-address";

export function ReceiveScreen() {
  const { address } = useAccount();

  const toast = useToastController();
  const navigation = useNavigation();

  if (!address) {
    return null;
  }

  const copyAddress = async () => {
    Clipboard.setStringAsync(address).then(() =>
      toast.show("Copied!", {
        duration: 1000,
        burntOptions: {
          preset: "none",
          // @ts-expect-error: for some reason `duration` is omitted in types
          duration: 1,
        },
      }),
    );
  };

  const shareAddress = async () => {
    await Share.share({ message: address });
  };

  return (
    <PanModal.Content>
      <SafeAreaStack
        justifyContent="space-between"
        backgroundColor="$background"
        padding="$4"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$8" fontWeight="700">
            Receive
          </Text>

          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} />
          </Pressable>
        </XStack>

        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$3"
          space="$5"
        >
          <TouchableOpacity onPress={copyAddress}>
            <Text color="$color10" fontSize="$6" fontWeight="500" letterSpacing={0.25}>
              {shortenAddress(address, 6)} <Ionicons name="copy-outline" size={16} />
            </Text>
          </TouchableOpacity>

          <XStack padding="$4" backgroundColor="white" borderRadius="$8" elevation={16}>
            <QrCode
              value={address}
              size={Dimensions.get("window").width * 0.75}
              backgroundColor="white"
            />
          </XStack>

          <Text color="$color10" fontSize="$2" textAlign="center">
            You can use this address to receive ETH and other Ethereum based tokens such
            as USDC. Sending other assets may result in permanent loss.
          </Text>
        </YStack>

        <Theme inverse>
          <Button
            size="$5"
            onPress={shareAddress}
            fontSize="$6"
            fontWeight="600"
            marginHorizontal="$8"
            backgroundColor="$backgroundStrong"
            borderRadius="$12"
          >
            Share Address
          </Button>
        </Theme>
      </SafeAreaStack>
    </PanModal.Content>
  );
}
