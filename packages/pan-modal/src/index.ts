import { PanModalContent } from "./content";
import { PanModalOffscreen } from "./offscreen";
import { PanModalTrigger } from "./trigger";

export { PanModalProvider } from "./context";

export const PanModal = {
  Trigger: PanModalTrigger,
  Content: PanModalContent,
  Offscreen: PanModalOffscreen,
};
