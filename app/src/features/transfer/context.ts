import { createContext, useContext } from "react";
import type { Address } from "viem";
import type { Asset } from "~/features/assets";

interface TransferContextType {
  recipientAddress?: Address;
  transferAsset?: Asset;
  transferValue?: bigint;

  actions: {
    setRecipientAddress: (value?: Address) => void;
    setTransferAsset: (value?: Asset) => void;
    setTransferValue: (value?: bigint) => void;
  };
}

export const TransferContext = createContext<TransferContextType>({} as never);

export const useTransferContext = () => useContext(TransferContext);
