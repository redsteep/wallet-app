import {
  LocalAccountSigner,
  SimpleSmartContractAccount,
  SmartAccountProvider,
  type SmartAccountProviderOpts,
} from "@alchemy/aa-core";
import type { Hex, WalletClient as WalletClient_ } from "viem";
import { createWalletClient, http, type Account, type Transport } from "viem";
import { Connector, ConnectorNotFoundError, type Chain } from "wagmi";
import {
  BUNDLER_URL,
  ENTRYPOINT_ADDRESS,
  SIMPLE_ACCOUNT_FACTORY_ADDRESS,
} from "~/lib/env-variables";

type WalletClient<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TAccount extends Account = Account,
> = WalletClient_<TTransport, TChain, TAccount>;

type Opts = SmartAccountProviderOpts & {
  privateKey?: Hex;
};

export class SmartAccountConnector extends Connector<SmartAccountProvider, Opts> {
  readonly id = "smart-account";
  readonly name = "Smart Account";
  readonly ready = true;

  #chain: Chain;
  #provider?: SmartAccountProvider;

  constructor({ chain, options }: { chain: Chain; options: Opts }) {
    super({ options });
    this.#chain = chain;
  }

  async connect() {
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();

    if (provider.on) {
      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);
      provider.on("disconnect", this.onDisconnect);
    }

    this.emit("message", { type: "connecting" });

    const account = await this.getAccount();
    const id = await this.getChainId();

    return {
      account,
      chain: { id, unsupported: this.isChainUnsupported(id) },
    };
  }

  async disconnect() {
    const provider = await this.getProvider();
    if (!provider?.removeListener) return;

    provider.removeListener("accountsChanged", this.onAccountsChanged);
    provider.removeListener("chainChanged", this.onChainChanged);
    provider.removeListener("disconnect", this.onDisconnect);
  }

  async getAccount() {
    const provider = await this.getProvider();
    if (!provider?.account) throw new ConnectorNotFoundError();
    return await provider.account.getAddress();
  }

  async getChainId() {
    return this.#chain.id;
  }

  async getProvider() {
    if (!this.#provider) {
      if (!this.options.privateKey) {
        throw new ConnectorNotFoundError();
      }

      const accountSigner = LocalAccountSigner.privateKeyToAccountSigner(
        this.options.privateKey,
      );

      this.#provider = new SmartAccountProvider(
        BUNDLER_URL,
        ENTRYPOINT_ADDRESS as Hex,
        this.#chain,
      ).connect(
        (rpcClient) =>
          new SimpleSmartContractAccount({
            owner: accountSigner,
            entryPointAddress: ENTRYPOINT_ADDRESS as Hex,
            factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS as Hex,
            chain: this.#chain,
            rpcClient,
          }),
      );
    }
    return this.#provider;
  }

  async getWalletClient(): Promise<WalletClient> {
    const provider = await this.getProvider();
    const account = await this.getAccount();
    if (!provider) throw new Error("provider is required.");
    return createWalletClient({
      account,
      chain: this.#chain,
      transport: http(BUNDLER_URL),
    });
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  protected onAccountsChanged(_accounts: string[]) {
    // Not relevant for us for now.
  }

  protected onChainChanged(_chainId: string | number) {
    // Not relevant for us because smart contract wallets only exist on single chain.
  }

  protected onDisconnect() {
    this.emit("disconnect");
  }
}
