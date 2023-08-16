import { hexlify } from "ethers";
import { useQuery } from "react-query";
import { ESTIMATE_CREATION_GAS } from "~/lib/query-keys";
import { useRpcProvider } from "~/providers/ethers-rpc-provider";

export function useEstimateCreationGas(initCode?: string) {
  const { rpcProvider } = useRpcProvider();

  return useQuery(
    [ESTIMATE_CREATION_GAS, initCode],
    () => {
      const initCodeHex = hexlify(initCode!);
      if (!initCodeHex || initCodeHex === "0x") {
        return 0n;
      }
      const factory = initCodeHex.substring(0, 42);
      const callData = "0x" + initCodeHex.substring(42);
      return rpcProvider.estimateGas({ to: factory, data: callData });
    },
    {
      enabled: Boolean(initCode),
      initialData: 0n,
    },
  );
}
