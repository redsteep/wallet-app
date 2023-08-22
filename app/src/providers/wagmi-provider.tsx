import { useEffect } from "react";
import { type Address, WagmiConfig, configureChains, createConfig, sepolia } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  BUNDLER_URL,
  ENTRYPOINT_ADDRESS,
  PAYMASTER_URL,
  SIMPLE_ACCOUNT_FACTORY_ADDRESS,
} from "~/lib/env-variables";
import { SmartAccountConnector } from "~/lib/smart-account-connector";
import { useWeb3Auth } from "~/lib/web3auth";

const { publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider()],
);

const wagmiConfig = createConfig({
  publicClient,
  webSocketPublicClient,
  autoConnect: true,
});

export function WagmiProvider({ children }: React.PropsWithChildren) {
  const privateKey = useWeb3Auth((state) => state.privateKey);

  useEffect(() => {
    if (typeof privateKey === "undefined") {
      return;
    }

    const connector = new SmartAccountConnector({
      chains: [sepolia],
      options: {
        privateKey,
        bundlerUrl: BUNDLER_URL,
        paymasterUrl: PAYMASTER_URL,
        entryPointAddress: ENTRYPOINT_ADDRESS as Address,
        factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS as Address,
        paymasterToken: "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B",
      },
    });

    wagmiConfig.setConnectors([connector]);
    wagmiConfig.autoConnect();

    return () => {
      wagmiConfig.clearState();
    };
  }, [privateKey]);

  return <WagmiConfig config={wagmiConfig} children={children} />;
}
