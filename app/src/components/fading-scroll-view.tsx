import React from "react";

import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type ScrollViewProps,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface FadingScrollViewProps extends React.PropsWithChildren<ScrollViewProps> {
  fadeOffset?: number;
  fadeDistance?: number;
  gradientColors?: [string, string];
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function FadingScrollView({
  fadeOffset = 10,
  fadeDistance = 25,
  gradientColors = ["#FFFFFF", "#FFFFFF00"],
  children,
  ...props
}: FadingScrollViewProps) {
  const nativeScrollEvent = useSharedValue<NativeScrollEvent | null>(null, true);
  const scrollableHeight = useSharedValue(0, true);
  const contentHeight = useSharedValue(0, true);

  const handleLayoutChange = ({ nativeEvent }: LayoutChangeEvent) =>
    (scrollableHeight.value = nativeEvent.layout.height);

  const handleContentSizeChange = (_: number, height: number) =>
    (contentHeight.value = height);

  const scrollHandler = useAnimatedScrollHandler(
    (event) => (nativeScrollEvent.value = event),
  );

  const startGradientStyle = useAnimatedStyle(() => {
    if (!nativeScrollEvent.value) {
      return {
        opacity: 0,
      };
    }

    return {
      opacity: interpolate(
        nativeScrollEvent.value.contentOffset.y,
        [0, fadeOffset],
        [0, 1],
      ),
    };
  });

  const endGradientStyle = useAnimatedStyle(() => {
    if (!nativeScrollEvent.value) {
      return {
        opacity: contentHeight.value > scrollableHeight.value ? 1 : 0,
      };
    }

    const { contentOffset, layoutMeasurement, contentSize } = nativeScrollEvent.value;

    if (contentHeight.value <= scrollableHeight.value) {
      return {
        opacity: interpolate(contentOffset.y, [0, -fadeOffset], [0, 1]),
      };
    }

    return {
      opacity: interpolate(
        layoutMeasurement.height + contentOffset.y,
        [layoutMeasurement.height, contentSize.height],
        [1, 0],
      ),
    };
  });

  return (
    <View style={styles.wrapperStyle} onLayout={handleLayoutChange}>
      <AnimatedLinearGradient
        style={[startGradientStyle, styles.startGradientStyle, { height: fadeDistance }]}
        pointerEvents="none"
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <AnimatedLinearGradient
        style={[endGradientStyle, styles.endGradientStyle, { height: fadeDistance }]}
        pointerEvents="none"
        colors={gradientColors}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      />

      {/* @ts-expect-error */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        onContentSizeChange={handleContentSizeChange}
        scrollEventThrottle={64}
        {...props}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperStyle: {
    flex: 1,
  },
  startGradientStyle: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
  },
  endGradientStyle: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 1,
  },
});
