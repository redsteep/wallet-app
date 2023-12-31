import { useQuery } from "react-query";

interface MarketChartData {
  prices: [timestamp: number, price: number][];
}

interface UserMarketChartsArgs {
  coinGeckoId?: string;
  days: number | "max";
  againstCurrency?: string;
}

export function useMarketCharts({
  coinGeckoId,
  days,
  againstCurrency = "usd",
}: UserMarketChartsArgs) {
  return useQuery(
    ["market-charts", coinGeckoId, days, againstCurrency],
    async ({ signal }) => {
      const url = new URL(
        `https://api.coingecko.com/api/v3/coins/${coinGeckoId}/market_chart`,
      );
      url.searchParams.append("vs_currency", againstCurrency);
      url.searchParams.append("days", String(days));

      const response = await fetch(url, { signal });
      return (await response.json()) as MarketChartData;
    },
    {
      enabled: Boolean(coinGeckoId),
      refetchInterval: 60 * 1000,
      staleTime: 60 * 1000,
    },
  );
}
