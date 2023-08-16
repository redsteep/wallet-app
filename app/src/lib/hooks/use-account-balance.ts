import type { AddressLike } from "ethers";
import { useQuery } from "react-query";
import { ACCOUNT_BALANCE } from "~/lib/query-keys";
import { useRpcProvider } from "~/providers/ethers-rpc-provider";

export function useAccountBalance(accountAddress?: AddressLike) {
  const { rpcProvider } = useRpcProvider();

  return useQuery(
    [ACCOUNT_BALANCE, accountAddress],
    () => rpcProvider.getBalance(accountAddress!),
    {
      enabled: Boolean(accountAddress),
      refetchInterval: 1 * 1000,
      initialData: 0n,
    },
  );
}
