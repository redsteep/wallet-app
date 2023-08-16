import type { AddressLike } from "ethers";
import { useQuery } from "react-query";
import { IS_DEPLOYED } from "~/lib/query-keys";
import { useRpcProvider } from "~/providers/ethers-rpc-provider";

export function useIsDeployed(accountAddress?: AddressLike) {
  const { rpcProvider } = useRpcProvider();

  return useQuery(
    [IS_DEPLOYED, accountAddress],
    async () => (await rpcProvider.getCode(accountAddress!)) !== "0x",
    { enabled: Boolean(accountAddress) },
  );
}
