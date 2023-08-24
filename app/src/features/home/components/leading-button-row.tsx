import { TouchableOpacity } from "react-native";
import { Button, Text, XStack, YStack, styled } from "tamagui";
import { useWeb3Auth } from "~/lib/web3auth";
import { shortenAddress } from "~/utils/shorten-address";
import Ionicons from "@expo/vector-icons/Ionicons";
import { VerticalButton } from "~/features/home/components/vertical-button";
import { PanModal } from "@wallet/pan-modal";

export function LeadingButtonRow() {
  return (
    <XStack alignItems="center" justifyContent="space-between" space="$3">
      <VerticalButton destination={{ name: "Transfer", params: { tokenAddress: "" } }}>
        <VerticalButton.Icon backgroundColor="#49CF57">
          <Ionicons name="arrow-up" color="white" size={24} />
        </VerticalButton.Icon>
        <VerticalButton.Text>Receive</VerticalButton.Text>
      </VerticalButton>

      <VerticalButton destination={{ name: "Transfer", params: { tokenAddress: "" } }}>
        <VerticalButton.Icon backgroundColor="#119BFF">
          <Ionicons name="arrow-down" color="white" size={24} />
        </VerticalButton.Icon>
        <VerticalButton.Text>Send</VerticalButton.Text>
      </VerticalButton>

      <VerticalButton destination={{ name: "Transfer", params: { tokenAddress: "" } }}>
        <VerticalButton.Icon backgroundColor="#B3B3B3">
          <Ionicons name="swap-vertical" color="white" size={24} />
        </VerticalButton.Icon>
        <VerticalButton.Text>Swap</VerticalButton.Text>
      </VerticalButton>

      {/* <VerticalButton title="Send" iconName="arrow-down" /> */}
      {/* <VerticalButton title="Swap" iconName="swap-vertical" /> */}
    </XStack>
  );
}

function LeadingButton({
  title,
  iconName,
}: {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Button size="$4" icon={<Ionicons name={iconName} size={24} />}>
      {title}
    </Button>
  );
}
