import { Wallet } from "ethers";
import { useQuery } from "react-query";
import { Presets, type IPresetBuilderOpts } from "userop";
import {
  BUNDLER_URL,
  ENTRYPOINT_ADDRESS,
  PAYMASTER_URL,
  SIMPLE_ACCOUNT_FACTORY_ADDRESS,
  USE_PAYMASTER,
} from "~/lib/env-variables";
import { SIMPLE_ACCOUNT } from "~/lib/query-keys";
import { useWeb3Auth } from "~/lib/web3auth";

export function useSimpleAccountQuery() {
  const privateKey = useWeb3Auth((state) => state.privateKey);

  return useQuery(
    [SIMPLE_ACCOUNT, privateKey],
    async () => {
      const options: IPresetBuilderOpts = {
        entryPoint: ENTRYPOINT_ADDRESS,
        factory: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
      };

      if (USE_PAYMASTER) {
        options.paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
          PAYMASTER_URL,
          {},
        );
      }

      return await Presets.Builder.SimpleAccount.init(
        new Wallet(privateKey!) as never,
        BUNDLER_URL,
        options,
      );
    },
    {
      enabled: Boolean(privateKey),
      staleTime: Infinity,
    },
  );
}

export function useSimpleAccount() {
  return useSimpleAccountQuery()["data"];
}
