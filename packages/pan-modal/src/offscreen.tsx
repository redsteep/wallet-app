import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePanModalContext } from "./context";
import { withAnchorPoint } from "./utils/transform-anchor";

interface PanModalOffscreenProps extends React.PropsWithChildren {
  disableScaling?: boolean;
}

export function PanModalOffscreen({ disableScaling, children }: PanModalOffscreenProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const windowDimensions = useWindowDimensions();
  const panModalContext = usePanModalContext();

  const animatedStyle = useAnimatedStyle(() => {
    if (disableScaling) {
      return {};
    }

    const scale = interpolate(
      panModalContext.transitionProgress.value,
      [0.0, 1.0],
      [1.0, (windowDimensions.height - safeAreaInsets.top) / windowDimensions.height],
      Extrapolate.CLAMP,
    );

    const borderRadius = interpolate(
      panModalContext.transitionProgress.value,
      [0.0, 1.0],
      [0.0, 16.0],
    );

    return {
      ...(withAnchorPoint(
        { transform: [{ scale }] },
        { x: 0.5, y: 1 },
        windowDimensions,
      ) as object),

      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      borderCurve: "continuous",
      overflow: "hidden",
    };
  });

  return (
    <>
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: "white" }]}
        pointerEvents="none"
      />
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        {children}
      </Animated.View>
    </>
  );
}
