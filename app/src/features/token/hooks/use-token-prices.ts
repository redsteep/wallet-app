import { useQuery } from "react-query";
import type { Asset } from "~/features/assets";
import { type FetchBalanceResult, fetchBalance } from "wagmi/actions";
import { type Address } from "viem";

export function useTokenPrices({
  tokens,
  address,
  againstCurrency = "usd",
}: {
  tokens: Asset[];
  address?: Address;
  againstCurrency?: string;
}) {
  if (tokens.some((asset) => !asset.coinGeckoId)) {
    throw new Error("One of the assets doesn't have a coin ID");
  }

  return useQuery(
    ["coin-prices", tokens, againstCurrency],
    async ({ signal }) => {
      const balances = await Promise.all(
        tokens.map((asset) =>
          fetchBalance({
            address: address!,
            token: asset.tokenAddress,
          }),
        ),
      );

      const url = new URL("https://api.coingecko.com/api/v3/simple/price");
      url.searchParams.append("ids", tokens.map((asset) => asset.coinGeckoId).join(","));
      url.searchParams.append("vs_currencies", againstCurrency);

      const response = await fetch(url, { signal });
      const json = await response.json();

      return tokens.map<[FetchBalanceResult, number]>((asset, idx) => [
        balances[idx],
        json?.[asset.coinGeckoId!]?.[againstCurrency] ?? 0.0,
      ]);
    },
    {
      enabled: Boolean(address) && tokens.length > 0,
      refetchInterval: 60 * 1000,
      staleTime: 60 * 1000,
    },
  );
}
