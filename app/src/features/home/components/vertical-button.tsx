import { Stack, Text, styled, withStaticProperties } from "@tamagui/web";
import { PanModal } from "@wallet/pan-modal";

// @ts-expect-error
export const ButtonFrame = styled(PanModal.Trigger, {
  flex: 1,
  flexDirection: "column",
  alignItems: "center",

  backgroundColor: "$background",
  borderRadius: "$6",
  userSelect: "none",

  padding: "$2.5",
  space: "$1.5",

  hoverStyle: {
    backgroundColor: "$backgroundHover",
  },
  pressStyle: {
    backgroundColor: "$backgroundPress",
  },
});

export const ButtonText = styled(Text, {
  color: "$color",
  fontSize: "$3",
  fontWeight: "500",
});

export const ButtonIcon = styled(Stack, {
  width: "$3",
  height: "$3",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "$10",
  overflow: "hidden",
});

export const VerticalButton = withStaticProperties(ButtonFrame, {
  Text: ButtonText,
  Icon: ButtonIcon,
});
