import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";
import { useCallback, useEffect, useMemo } from "react";
import { View, type ViewProps } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useWindowDimensions } from "tamagui";
import { PanModalPresentationState, usePanModalContext } from "../context";
import {
  CORNER_RADIUS,
  EMPTY_DIMENSIONS,
  FLING_LIMIT,
  SPRING_CONFIG,
} from "../utils/constants";

type PanModalContentProps = ViewProps;

export function PanModalContentRoot({
  style,
  children,
  ...props
}: React.PropsWithChildren<PanModalContentProps>) {
  const navigation = useNavigation();
  const windowDimensions = useWindowDimensions();

  const {
    layout,
    translation,
    triggerState,
    transitionProgress,
    presentationState,
    resetState,
  } = usePanModalContext();

  const rootDimensions = triggerState.value?.dimensions.root ?? EMPTY_DIMENSIONS;
  const defaultBorderRadius = triggerState.value?.style?.borderRadius ?? 0.0;

  const borderRadius = useSharedValue(defaultBorderRadius);
  const runHapticFeedback = useSharedValue(true);

  useEffect(() => {
    presentationState.value = PanModalPresentationState.Presenting;

    layout.width.value = rootDimensions.width;
    layout.height.value = rootDimensions.height;
    layout.top.value = rootDimensions.pageY;
    layout.left.value = rootDimensions.pageX;

    layout.width.value = withSpring(windowDimensions.width, SPRING_CONFIG);
    layout.height.value = withSpring(windowDimensions.height, SPRING_CONFIG);
    layout.top.value = withSpring(0.0, SPRING_CONFIG);
    layout.left.value = withSpring(0.0, SPRING_CONFIG);

    borderRadius.value = withSequence(
      withSpring(CORNER_RADIUS, SPRING_CONFIG),
      withSpring(0.0, SPRING_CONFIG),
    );
  }, []);

  const dismissModal = useCallback(() => {
    presentationState.value = PanModalPresentationState.Dismissing;

    layout.width.value = withSpring(rootDimensions.width, SPRING_CONFIG);
    layout.height.value = withSpring(rootDimensions.height, SPRING_CONFIG);
    layout.top.value = withSpring(rootDimensions.pageY, SPRING_CONFIG);
    layout.left.value = withSpring(rootDimensions.pageX, SPRING_CONFIG);

    borderRadius.value = withSpring(defaultBorderRadius, SPRING_CONFIG);
  }, []);

  useFocusEffect(
    useCallback(
      () =>
        navigation.addListener("beforeRemove", ({ preventDefault }) => {
          if (presentationState.value === PanModalPresentationState.Dismissed) {
            resetState();
            return;
          }
          preventDefault();
          dismissModal();
        }),
      [],
    ),
  );

  useAnimatedReaction(
    () => {
      return layout.width.value + layout.height.value;
    },
    (currentValue) => {
      transitionProgress.value = interpolate(
        currentValue,
        [
          rootDimensions.width + rootDimensions.height,
          windowDimensions.width + windowDimensions.height,
        ],
        [0.0, 1.0],
        Extrapolate.CLAMP,
      );
    },
  );

  useAnimatedReaction(
    () => {
      return transitionProgress.value;
    },
    (currentValue) => {
      if (
        presentationState.value === PanModalPresentationState.Dismissing &&
        currentValue < 0.001
      ) {
        presentationState.value = PanModalPresentationState.Dismissed;
        runOnJS(navigation.goBack)();
      }
    },
  );

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .onChange((event) => {
        if (presentationState.value !== PanModalPresentationState.Dismissing) {
          presentationState.value = PanModalPresentationState.Dragging;

          borderRadius.value = interpolate(
            Math.abs(translation.x.value) + Math.abs(translation.y.value),
            [250.0, 0.0],
            [16.0, CORNER_RADIUS],
            Extrapolate.CLAMP,
          );

          translation.x.value += event.changeX / 2;
          translation.y.value += event.changeY / 2;

          if (
            Math.abs(event.translationX) > FLING_LIMIT ||
            Math.abs(event.translationY) > FLING_LIMIT
          ) {
            if (runHapticFeedback.value) {
              runOnJS(impactAsync)(ImpactFeedbackStyle.Medium);
              runHapticFeedback.value = false;
            }
          } else {
            runHapticFeedback.value = true;
          }
        }
      })
      .onFinalize((event) => {
        if (presentationState.value === PanModalPresentationState.Dragging) {
          presentationState.value = PanModalPresentationState.Presented;

          const animationCallback = () => {
            if (translation.x.value == 0.0 && translation.y.value == 0.0) {
              borderRadius.value = withSpring(0.0);
            }
          };

          translation.x.value = withSpring(0.0, SPRING_CONFIG, animationCallback);
          translation.y.value = withSpring(0.0, SPRING_CONFIG, animationCallback);

          if (
            Math.abs(event.translationX) > FLING_LIMIT ||
            Math.abs(event.translationY) > FLING_LIMIT
          ) {
            runOnJS(dismissModal)();
          }
        }
      });
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      Math.abs(translation.x.value) + Math.abs(translation.y.value),
      [0.0, 250.0, 500.0],
      [1.0, 0.8, 0.75],
      Extrapolate.CLAMP,
    );

    return {
      width: layout.width.value,
      height: layout.height.value,
      top: layout.top.value,
      left: layout.left.value,

      transform: [
        { scale: scale },
        { translateX: translation.x.value * scale },
        { translateY: translation.y.value * scale },
      ],

      borderRadius: borderRadius.value,
      borderCurve: "continuous",
      overflow: "hidden",
    };
  });

  const fixedContainerStyle = {
    minWidth: windowDimensions.width,
    minHeight: windowDimensions.height,
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedCardStyle} collapsable={false}>
        <View style={[style, fixedContainerStyle]} {...props}>
          {children}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
