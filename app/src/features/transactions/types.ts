import type { Address, Hash, Hex, Transaction, TransactionReceipt } from "viem";
import type { Asset } from "~/features/assets";

export type TransactionRequest = {
  from: Address;
  to: Address;
  asset: Asset;
  value: bigint;
  data?: Hex;
};

export type PendingTransaction = TransactionRequest & {
  id: string;
  paymasterApproveHash: Hash | null;
  transactionHash: Hash | null;
};

export type CompletedTransaction = Omit<Transaction, "to"> &
  Pick<TransactionReceipt, "status"> & {
    to: Address;
    asset: Asset;
  };
