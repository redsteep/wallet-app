import type { Address } from "viem";

export interface Asset {
  tokenName: string;
  tokenAddress?: Address;
  coinGeckoId?: string;
}

// TODO: move away from predefined assets
export const ownedAssets: Asset[] = [
  {
    tokenName: "Ethereum",
    coinGeckoId: "ethereum",
  },
  {
    tokenName: "Stackup Test Token",
    tokenAddress: "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B",
  },
];
