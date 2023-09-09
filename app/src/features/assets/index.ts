import type { ImageSource } from "expo-image";
import type { Address } from "viem";

export interface Asset {
  tokenName: string;
  tokenImage?: ImageSource;
  tokenAddress?: Address;
  coinGeckoId?: string;
}
