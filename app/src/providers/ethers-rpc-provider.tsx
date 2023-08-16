import { JsonRpcProvider } from "ethers";
import { createContext, useContext, useMemo } from "react";
import { BUNDLER_URL } from "~/lib/env-variables";

interface EthersRpcProviderContextType {
  rpcProvider: JsonRpcProvider;
}

const EthersRpcProviderContext = createContext<EthersRpcProviderContextType>({
  rpcProvider: undefined as never,
});

export function useRpcProvider() {
  return useContext(EthersRpcProviderContext);
}

export function EthersRpcProvider({ children }: React.PropsWithChildren) {
  const rpcProvider = useMemo(() => new JsonRpcProvider(BUNDLER_URL), []);

  return (
    <EthersRpcProviderContext.Provider value={{ rpcProvider }}>
      {children}
    </EthersRpcProviderContext.Provider>
  );
}
