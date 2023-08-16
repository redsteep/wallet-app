import { createContext, useContext } from "react";
import { type MeasuredDimensions } from "react-native-reanimated";

interface PanModalTriggerContextType {
  id: string;
  heroDimensions: React.MutableRefObject<
    Omit<MeasuredDimensions, "pageX" | "pageY"> | undefined
  >;
}

export const PanModalTriggerContext = createContext<PanModalTriggerContextType>({
  id: null as never,
  heroDimensions: null as never,
});

export function usePanModalTriggerContext() {
  return useContext(PanModalTriggerContext);
}
