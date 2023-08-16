import { createContext, memo, useCallback, useContext } from "react";
import type Animated from "react-native-reanimated";
import { useSharedValue, type MeasuredDimensions } from "react-native-reanimated";

export enum PanModalPresentationState {
  None,
  Presenting,
  Presented,
  Dragging,
  Dismissing,
  Dismissed,
}

export interface PanModalTriggerState {
  id: string;
  dimensions: {
    root?: MeasuredDimensions;
    hero?: Omit<MeasuredDimensions, "pageX" | "pageY">;
  };
  style?: {
    borderRadius: number;
  };
}

interface PanModalContextType {
  layout: {
    width: Animated.SharedValue<number>;
    height: Animated.SharedValue<number>;
    top: Animated.SharedValue<number>;
    left: Animated.SharedValue<number>;
  };
  translation: {
    x: Animated.SharedValue<number>;
    y: Animated.SharedValue<number>;
  };
  triggerState: Animated.SharedValue<PanModalTriggerState | null>;
  presentationState: Animated.SharedValue<PanModalPresentationState>;
  transitionProgress: Animated.SharedValue<number>;
  resetState: () => void;
}

const PanModalContext = createContext<PanModalContextType>(null as never);

export function usePanModalContext() {
  const panModalContext = useContext(PanModalContext);
  if (!panModalContext) {
    throw new Error("No PanModalProvider found when calling usePanModalContext.");
  }
  return panModalContext;
}

export const PanModalProvider = memo(({ children }: React.PropsWithChildren) => {
  const triggerState = useSharedValue<PanModalTriggerState | null>(null);
  const presentationState = useSharedValue(PanModalPresentationState.None);
  const transitionProgress = useSharedValue(0.0);

  const layout = {
    width: useSharedValue(0.0),
    height: useSharedValue(0.0),
    top: useSharedValue(0.0),
    left: useSharedValue(0.0),
  };

  const translation = {
    x: useSharedValue(0.0),
    y: useSharedValue(0.0),
  };

  const resetState = useCallback(() => {
    Object.values(layout).forEach((animation) => (animation.value = 0.0));
    Object.values(translation).forEach((animation) => (animation.value = 0.0));

    triggerState.value = null;
    presentationState.value = PanModalPresentationState.None;
    transitionProgress.value = 0.0;
  }, []);

  return (
    <PanModalContext.Provider
      value={{
        layout,
        translation,
        triggerState,
        transitionProgress,
        presentationState,
        resetState,
      }}
    >
      {children}
    </PanModalContext.Provider>
  );
});
