import { useId, useMemo, useRef, type ElementRef, forwardRef } from "react";
import { StyleSheet, type ViewProps } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  withTiming,
  type MeasuredDimensions,
} from "react-native-reanimated";
import {
  PanModalPresentationState,
  usePanModalContext,
  type PanModalTriggerState,
} from "../context";
import { PanModalTriggerContext } from "./context";
import { type Route, useNavigation } from "@react-navigation/native";

interface PanModalTriggerRootProps<T extends string>
  extends React.PropsWithChildren<ViewProps> {
  destination: Omit<Route<T>, "key">;
}

export const PanModalTriggerRoot = forwardRef(
  <T extends string>(
    { destination, style, children, ...props }: PanModalTriggerRootProps<T>,
    _: unknown,
  ) => {
    const id = useId();
    const navigation = useNavigation();

    const { triggerState, presentationState } = usePanModalContext();

    const ref = useAnimatedRef<ElementRef<typeof Animated.View>>();
    const heroDimensions = useRef<MeasuredDimensions>();

    const navigate = (measuredRootDimensions: MeasuredDimensions) => {
      const flattenedStyle = StyleSheet.flatten(style);
      const borderRadius =
        flattenedStyle?.borderRadius ?? flattenedStyle?.borderTopLeftRadius ?? 0.0;

      const newTriggerState: PanModalTriggerState = {
        id,
        dimensions: {
          root: measuredRootDimensions,
          hero: heroDimensions.current,
        },
      };

      if (typeof borderRadius === "number") {
        newTriggerState.style = {
          borderRadius,
        };
      }

      triggerState.value = newTriggerState;
      requestAnimationFrame(() => navigation.navigate(destination as never));
    };

    const tapGesture = useMemo(() => {
      return Gesture.Tap().onEnd(() => {
        if (presentationState.value !== PanModalPresentationState.None) {
          return;
        }
        const measuredDimensions = measure(ref);
        if (measuredDimensions !== null) {
          runOnJS(navigate)(measuredDimensions);
        }
      });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      const shouldShow =
        triggerState.value?.id !== id ||
        (presentationState.value !== PanModalPresentationState.Presented &&
          presentationState.value !== PanModalPresentationState.Dragging);

      return {
        opacity: withTiming(shouldShow ? 1 : 0, {
          duration: 0,
        }),
      };
    });

    return (
      <PanModalTriggerContext.Provider value={{ id, heroDimensions }}>
        <GestureDetector gesture={tapGesture}>
          <Animated.View
            ref={ref}
            style={[style, animatedStyle]}
            collapsable={false}
            {...props}
          >
            {children}
          </Animated.View>
        </GestureDetector>
      </PanModalTriggerContext.Provider>
    );
  },
);
