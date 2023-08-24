import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useToastController } from "@tamagui/toast";
import { PanModal } from "@wallet/pan-modal";
import * as Clipboard from "expo-clipboard";
import { Dimensions, Pressable, Share, TouchableOpacity } from "react-native";
import { Button, Text, XStack, YStack, useTheme } from "tamagui";
import { useAccount } from "wagmi";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { QrCode } from "~/features/receive-assets/components/qr-code";
import { shortenAddress } from "~/utils/shorten-address";

export function ReceiveScreen() {
  const theme = useTheme();
  const toast = useToastController();
  const navigation = useNavigation();
  const { address } = useAccount();

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
          space="$4"
        >
          <TouchableOpacity onPress={copyAddress}>
            <Text color="$color10" fontSize="$5" fontWeight="500">
              {shortenAddress(address, 6)} <Ionicons name="copy-outline" size={16} />
            </Text>
          </TouchableOpacity>

          <XStack
            padding="$4"
            backgroundColor="$background"
            borderRadius="$8"
            elevation={16}
          >
            <QrCode
              value={address}
              size={Dimensions.get("window").width * 0.75}
              backgroundColor={theme.background.get()}
            />
          </XStack>

          <Text color="$color10" fontSize="$2" fontWeight="400" textAlign="center">
            You can use this address to receive ETH and other Ethereum based tokens such
            as USDC. Sending other assets may result in permanent loss.
          </Text>
        </YStack>

        <Button
          onPress={shareAddress}
          marginHorizontal="$10"
          backgroundColor="$color5"
          borderRadius="$8"
        >
          <Button.Text fontWeight="500">Share Address</Button.Text>
        </Button>
      </SafeAreaStack>
    </PanModal.Content>
  );
}
