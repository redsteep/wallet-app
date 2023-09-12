import { Stack, Text, styled, withStaticProperties } from "@tamagui/web";

export const ButtonFrame = styled(Stack, {
  alignItems: "center",
  backgroundColor: "$background",
  borderRadius: "$6",
  userSelect: "none",
  padding: "$2.5",
  space: "$2",
  hoverStyle: { backgroundColor: "$backgroundHover" },
  pressStyle: { backgroundColor: "$backgroundPress" },
});

export const ButtonText = styled(Text, {
  color: "$color",
  fontSize: "$4",
  fontWeight: "500",
});

export const ButtonIcon = styled(Stack, {
  width: "$3",
  height: "$3",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "$10",
});

export const ActionButton = withStaticProperties(ButtonFrame, {
  Text: ButtonText,
  Icon: ButtonIcon,
});
