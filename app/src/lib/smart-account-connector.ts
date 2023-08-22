import {
  LocalAccountSigner,
  SimpleSmartContractAccount,
  SmartAccountProvider,
  type UserOperationRequest,
  type UserOperationStruct,
  deepHexlify,
  resolveProperties,
  type SmartAccountProviderOpts,
} from "@alchemy/aa-core";
import type { Address, Hex, WalletClient as WalletClient_ } from "viem";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  type Account,
  type Transport,
} from "viem";
import { Connector, ConnectorNotFoundError, type Chain } from "wagmi";

type WalletClient<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TAccount extends Account = Account,
> = WalletClient_<TTransport, TChain, TAccount>;

type SmartAccountConnectorOptions = SmartAccountProviderOpts & {
  privateKey: Hex;

  bundlerUrl: string;
  entryPointAddress: Address;
  factoryAddress: Address;

  paymasterUrl?: string;
  paymasterToken?: Address;
};

type SponsorUserOperationRequest = {
  Method: "pm_sponsorUserOperation";
  Parameters: [
    userOp: UserOperationStruct,
    entryPoint: Address,
    context: { type: "payg" } | { type: "erc20token"; token: Address },
  ];
  ReturnType: {
    paymasterAndData: Hex;
    preVerificationGas: Hex;
    verificationGasLimit: Hex;
    callGasLimit: Hex;
  };
};

export class SmartAccountConnector extends Connector<
  SmartAccountProvider,
  SmartAccountConnectorOptions
> {
  readonly id = "smart-account";
  readonly name = "Smart Account";
  readonly ready = true;

  #provider?: SmartAccountProvider;

  constructor({
    chains,
    options,
  }: {
    chains: [Chain, ...Chain[]];
    options: SmartAccountConnectorOptions;
  }) {
    super({ chains, options });
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
    if (!provider) throw new ConnectorNotFoundError();
    return await provider.getAddress();
  }

  async getChainId() {
    return this.chains[0].id;
  }

  async getProvider() {
    if (!this.#provider) {
      this.#provider = new SmartAccountProvider(
        this.options.bundlerUrl,
        this.options.entryPointAddress,
        this.chains[0],
      ).connect((rpcClient) => {
        return new SimpleSmartContractAccount({
          owner: LocalAccountSigner.privateKeyToAccountSigner(this.options.privateKey),
          factoryAddress: this.options.factoryAddress,
          entryPointAddress: this.options.entryPointAddress,
          chain: this.chains[0],
          rpcClient,
        });
      });

      if (this.options.paymasterUrl && this.options.paymasterToken) {
        const paymasterClient = createPublicClient({
          chain: this.chains[0],
          transport: http(this.options.paymasterUrl),
        });

        this.#provider = this.#provider.withPaymasterMiddleware({
          paymasterDataMiddleware: async (struct) => {
            const userOperation: UserOperationRequest = deepHexlify(
              await resolveProperties(struct),
            );

            const overrideGasFields =
              await paymasterClient.request<SponsorUserOperationRequest>({
                method: "pm_sponsorUserOperation",
                params: [
                  userOperation,
                  this.options.entryPointAddress,
                  { type: "erc20token", token: this.options.paymasterToken! },
                ],
              });

            return {
              ...userOperation,
              ...overrideGasFields,
            };
          },
        });
      }
    }
    return this.#provider;
  }

  async getWalletClient({ chainId }: { chainId?: number } = {}): Promise<WalletClient> {
    const [provider, account] = await Promise.all([
      this.getProvider(),
      this.getAccount(),
    ]);
    const chain = this.chains.find((x) => x.id === chainId);
    if (!provider) throw new Error("Provider is required.");
    return createWalletClient({
      account,
      chain,
      transport: custom(provider),
    });
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return Boolean(account);
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
