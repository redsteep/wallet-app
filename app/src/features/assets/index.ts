import type { ImageSource } from "expo-image";
import type { Address } from "viem";

export type Asset = {
  type: "eth" | "erc20";
  tokenName: string;
  tokenAddress?: Address;
  tokenImage?: ImageSource;
  coinGeckoId?: string;
};

export const nativeToken: Asset = {
  type: "eth",
  tokenName: "Ethereum",
  tokenImage: require("assets/ethereum.png"),
  coinGeckoId: "ethereum",
};

// TODO: move away from predefined assets
export const stackupToken: Asset = {
  type: "erc20",
  tokenName: "Stackup Test Token",
  tokenAddress: "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B",
};

export const ownedAssets = [nativeToken, stackupToken];
