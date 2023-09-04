import { useQuery } from "react-query";
import type { Asset } from "~/features/assets/assets";
import { type FetchBalanceResult, fetchBalance } from "wagmi/actions";
import { type Address } from "viem";

export function useCoinPrices({
  assets,
  address,
  againstCurrency = "usd",
}: {
  assets: Asset[];
  address?: Address;
  againstCurrency?: string;
}) {
  if (assets.some((asset) => !asset.coinGeckoId)) {
    throw new Error("One of the assets doesn't have a coin ID");
  }

  return useQuery(
    ["coin-prices", assets, againstCurrency],
    async ({ signal }) => {
      const balances = await Promise.all(
        assets.map((asset) =>
          fetchBalance({
            address: address!,
            token: asset.tokenAddress,
          }),
        ),
      );

      const url = new URL("https://api.coingecko.com/api/v3/simple/price");
      url.searchParams.append("ids", assets.map((asset) => asset.coinGeckoId).join(","));
      url.searchParams.append("vs_currencies", againstCurrency);

      const response = await fetch(url, { signal });
      const json = await response.json();

      return assets.map<[FetchBalanceResult, number]>((asset, idx) => [
        balances[idx],
        json?.[asset.coinGeckoId!]?.[againstCurrency] ?? 0.0,
      ]);
    },
    {
      enabled: Boolean(address) && assets.length > 0,
      refetchInterval: 60 * 1000,
      staleTime: 60 * 1000,
    },
  );
}
