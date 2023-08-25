import { useEffect } from "react";
import { WagmiConfig, configureChains, createConfig, sepolia, type Address } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  BUNDLER_URL,
  ENTRYPOINT_ADDRESS,
  PAYMASTER_TOKEN_ADDRESS,
  PAYMASTER_URL,
  SIMPLE_ACCOUNT_FACTORY_ADDRESS,
} from "~/lib/env-variables";
import { SmartAccountConnector } from "~/lib/smart-account-connector";
import { useWeb3Auth } from "~/lib/web3auth";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider()],
);

const smartAccountConnector = new SmartAccountConnector({
  chains,
  options: {
    bundlerUrl: BUNDLER_URL,
    entryPointAddress: ENTRYPOINT_ADDRESS as Address,
    factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS as Address,
    paymasterUrl: PAYMASTER_URL,
    paymasterTokenAddress: PAYMASTER_TOKEN_ADDRESS as Address,
  },
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [smartAccountConnector],
  publicClient,
  webSocketPublicClient,
});

export function WagmiProvider({ children }: React.PropsWithChildren) {
  const privateKey = useWeb3Auth((state) => state.privateKey);

  useEffect(() => {
    if (typeof privateKey === "undefined") {
      wagmiConfig.clearState();
      return;
    }
    smartAccountConnector.setSigner(privateKey);
    wagmiConfig.autoConnect();
  }, [privateKey]);

  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
