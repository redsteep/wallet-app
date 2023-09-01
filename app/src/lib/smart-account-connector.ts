import {
  LocalAccountSigner,
  type SimpleSmartAccountOwner,
  SimpleSmartContractAccount,
  SmartAccountProvider,
  deepHexlify,
  resolveProperties,
  type SmartAccountProviderOpts,
  type UserOperationRequest,
  type UserOperationStruct,
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
  bundlerUrl: string;
  entryPointAddress: Address;
  factoryAddress: Address;

  paymasterUrl?: string;
  paymasterTokenAddress?: Address;
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
  #signer?: SimpleSmartAccountOwner;

  constructor({
    chains,
    options,
  }: {
    chains: Chain[];
    options: SmartAccountConnectorOptions;
  }) {
    super({ chains, options });
  }

  async connect() {
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();
    if (!this.#signer) throw new Error("Signer is required");

    if (provider.on) {
      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);
      provider.on("disconnect", this.onDisconnect);
    }

    this.emit("message", { type: "connecting" });

    provider.connect((rpcClient) => {
      return new SimpleSmartContractAccount({
        owner: this.#signer!,
        factoryAddress: this.options.factoryAddress,
        entryPointAddress: this.options.entryPointAddress,
        chain: this.chains[0],
        rpcClient,
      });
    });

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
      );

      if (this.options.paymasterUrl && this.options.paymasterTokenAddress) {
        const paymasterClient = createPublicClient({
          chain: this.chains[0],
          transport: http(this.options.paymasterUrl),
        });

        this.#provider = this.#provider.withPaymasterMiddleware({
          dummyPaymasterDataMiddleware: async () => ({
            callGasLimit: 0n,
            preVerificationGas: 0n,
            verificationGasLimit: 0n,
            paymasterAndData: "0x",
          }),

          paymasterDataMiddleware: async (struct) => {
            const userOperation: UserOperationRequest = deepHexlify(
              await resolveProperties(struct),
            );

            return await paymasterClient.request<SponsorUserOperationRequest>({
              method: "pm_sponsorUserOperation",
              params: [
                userOperation,
                this.options.entryPointAddress,
                {
                  type: "erc20token",
                  token: this.options.paymasterTokenAddress!,
                },
              ],
            });
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

  async setSigner(privateKey: Hex) {
    this.#signer = LocalAccountSigner.privateKeyToAccountSigner(privateKey);
    // await this.connect();
  }

  async isAuthorized() {
    return typeof this.#signer !== "undefined";
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
