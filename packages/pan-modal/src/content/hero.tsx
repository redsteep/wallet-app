import { Image, type ImageProps } from "expo-image";
import { useMemo, type ElementRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  measure,
  useAnimatedRef,
  useAnimatedStyle,
} from "react-native-reanimated";
import { usePanModalContext } from "../context";

type PanModalDestinationProps = ImageProps;

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function PanModalContentHero({ style, ...props }: PanModalDestinationProps) {
  const panModalContext = usePanModalContext();

  const ref = useAnimatedRef<ElementRef<typeof AnimatedImage>>();
  const flattenedStyle = useMemo(() => StyleSheet.flatten(style), [style]);

  const animatedStyle = useAnimatedStyle(() => {
    const triggerState = panModalContext.triggerState.value;
    const dimensions = triggerState?.dimensions?.hero ?? triggerState?.dimensions?.root;

    let width = typeof flattenedStyle.width === "number" ? flattenedStyle.width : 0.0;
    let height = typeof flattenedStyle.height === "number" ? flattenedStyle.height : 0.0;

    if (!width || !height) {
      const measuredDimensions = measure(ref);
      if (measuredDimensions !== null) {
        width ||= measuredDimensions.width;
        height ||= measuredDimensions.height;
      }
    }

    return {
      width: interpolate(
        panModalContext.transitionProgress.value,
        [0.0, 1.0],
        [dimensions?.width ?? 0.0, width],
      ),
      height: interpolate(
        panModalContext.transitionProgress.value,
        [0.0, 1.0],
        [dimensions?.height ?? 0.0, height],
      ),
    };
  });

  return (
    <AnimatedImage
      ref={ref}
      style={[style, animatedStyle]}
      cachePolicy="memory-disk"
      priority="high"
      {...props}
    />
  );
}
