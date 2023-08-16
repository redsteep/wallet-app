import { Platform } from "react-native";
import type { MeasuredDimensions } from "react-native-reanimated";
import type { SpringConfig } from "react-native-reanimated/lib/typescript/reanimated2/animation/springUtils";

export const FLING_LIMIT = 80;

export const CORNER_RADIUS = Platform.OS === "ios" ? 55.0 : 12.0;

export const SPRING_CONFIG: SpringConfig = {
  mass: 0.15,
  damping: 8,
  stiffness: 60,
  overshootClamping: true,
};

export const EMPTY_DIMENSIONS: MeasuredDimensions = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  pageX: 0,
  pageY: 0,
};
