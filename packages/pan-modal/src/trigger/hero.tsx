import { Image, type ImageProps } from "expo-image";
import { useCallback } from "react";
import type { LayoutChangeEvent } from "react-native";
import Animated, { type AnimateProps } from "react-native-reanimated";
import { usePanModalTriggerContext } from "../trigger/context";

type PanModalTriggerImageProps = AnimateProps<ImageProps>;

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function PanModalTriggerHero(props: PanModalTriggerImageProps) {
  const panModalTriggerContext = usePanModalTriggerContext();

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    panModalTriggerContext.heroDimensions.current = event.nativeEvent.layout;
  }, []);

  return (
    <AnimatedImage
      onLayout={handleLayout}
      cachePolicy="memory-disk"
      priority="high"
      {...props}
    />
  );
}
