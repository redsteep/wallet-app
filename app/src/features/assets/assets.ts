// TODO: move away from predefined assets

import type { Address } from "viem";

export interface Asset {
  tokenName: string;
  tokenAddress?: Address;
}

export const ownedAssets: Asset[] = [
  { tokenName: "Ethereum" },
  {
    tokenName: "Stackup Test Token",
    tokenAddress: "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B",
  },
];
