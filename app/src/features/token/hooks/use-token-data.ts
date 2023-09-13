import { useQuery } from "react-query";
import { useBalance, type Address } from "wagmi";

interface UseTokenDataArgs {
  address?: Address;
  tokenAddress?: Address;
  coinGeckoId?: string;
}

export function useTokenData({ address, tokenAddress, coinGeckoId }: UseTokenDataArgs) {
  const { data: tokenBalance } = useBalance({
    address,
    token: tokenAddress,
    watch: true,
  });

  const { data: tokenData } = useQuery(
    ["token-data", coinGeckoId],
    async ({ signal }) => {
      const url = new URL(`https://api.coingecko.com/api/v3/coins/${coinGeckoId}`);
      url.searchParams.append("tickers", "false");
      url.searchParams.append("localization", "false");
      url.searchParams.append("community_data", "false");
      url.searchParams.append("developer_data", "false");

      const response = await fetch(url, { signal });
      return (await response.json()) as CoinGeckoData;
    },
    {
      enabled: Boolean(coinGeckoId),
      refetchInterval: 60 * 1000,
      staleTime: 60 * 1000,
    },
  );

  return {
    tokenData,
    tokenBalance,
    currentFiatPrice: tokenData?.market_data?.current_price.usd ?? 0.0,
    priceChangePercentageIn24h:
      tokenData?.market_data?.price_change_percentage_24h ?? 0.0,
  };
}

export interface CoinGeckoData {
  id: string;
  symbol: string;
  name: string;
  description: Description;
  links: Links;
  image: Image;
  market_data: MarketData;
  last_updated: Date;
}

interface Description {
  en: string;
}

interface Image {
  thumb: string;
  small: string;
  large: string;
}

interface Links {
  homepage: string[];
  blockchain_site: string[];
  official_forum_url: string[];
  chat_url: string[];
  announcement_url: string[];
  twitter_screen_name: string;
  facebook_username: string;
  bitcointalk_thread_identifier: null;
  telegram_channel_identifier: string;
  subreddit_url: string;
}

interface MarketData {
  current_price: Record<string, number>;
  total_value_locked: null;
  mcap_to_tvl_ratio: null;
  fdv_to_tvl_ratio: null;
  roi: Roi;
  ath: Record<string, number>;
  ath_change_percentage: Record<string, number>;
  ath_date: { [key: string]: Date };
  atl: Record<string, number>;
  atl_change_percentage: Record<string, number>;
  atl_date: { [key: string]: Date };
  market_cap: Record<string, number>;
  market_cap_rank: number;
  fully_diluted_valuation: Record<string, number>;
  total_volume: Record<string, number>;
  high_24h: Record<string, number>;
  low_24h: Record<string, number>;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_14d: number;
  price_change_percentage_30d: number;
  price_change_percentage_60d: number;
  price_change_percentage_200d: number;
  price_change_percentage_1y: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  price_change_24h_in_currency: Record<string, number>;
  price_change_percentage_1h_in_currency: Record<string, number>;
  price_change_percentage_24h_in_currency: Record<string, number>;
  price_change_percentage_7d_in_currency: Record<string, number>;
  price_change_percentage_14d_in_currency: Record<string, number>;
  price_change_percentage_30d_in_currency: Record<string, number>;
  price_change_percentage_60d_in_currency: Record<string, number>;
  price_change_percentage_200d_in_currency: Record<string, number>;
  price_change_percentage_1y_in_currency: Record<string, number>;
  market_cap_change_24h_in_currency: Record<string, number>;
  market_cap_change_percentage_24h_in_currency: Record<string, number>;
  total_supply: number;
  max_supply: null;
  circulating_supply: number;
  last_updated: Date;
}

interface Roi {
  times: number;
  currency: string;
  percentage: number;
}
