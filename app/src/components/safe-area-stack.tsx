import { forwardRef, useMemo } from "react";
import { StyleSheet, View, type DimensionValue, type ViewProps } from "react-native";
import { useSafeAreaInsets, type Edge } from "react-native-safe-area-context";
import { styled } from "tamagui";

const allEdges: Edge[] = ["top", "left", "right", "bottom"];

const propertySuffixMap: Record<Edge, string> = {
  top: "Top",
  left: "Left",
  right: "Right",
  bottom: "Bottom",
};

interface SafeAreaViewProps extends ViewProps {
  mode?: "padding" | "margin";
  edges?: Edge[];
}

export const SafeAreaView = forwardRef<View, SafeAreaViewProps>(
  ({ style, mode = "padding", edges = allEdges, ...rest }, ref) => {
    const insets = useSafeAreaInsets();

    const containerStyle = useMemo(() => {
      const flattenedStyle = StyleSheet.flatten(style) as Record<string, DimensionValue>;

      return Object.fromEntries(
        edges.map((edge) => {
          const propertyName = `${mode}${propertySuffixMap[edge]}`;
          const propertyValue = flattenedStyle[propertyName] ?? 0.0;

          return [
            propertyName,
            typeof propertyValue === "number"
              ? propertyValue + insets[edge]
              : insets[edge],
          ];
        }),
      );
    }, [style, edges, mode, insets]);

    return <View ref={ref} style={[style, containerStyle]} {...rest} />;
  },
);

export const SafeAreaStack = styled(SafeAreaView, {
  flex: 1,
});
