import { useEffect } from "react";
import { WagmiConfig, configureChains, createConfig, sepolia } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { SmartAccountConnector } from "~/lib/smart-account-connector";
import { useWeb3Auth } from "~/lib/web3auth";

const chain = sepolia;

const { publicClient, webSocketPublicClient } = configureChains(
  [chain],
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
      chain,
      options: {
        privateKey,
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
