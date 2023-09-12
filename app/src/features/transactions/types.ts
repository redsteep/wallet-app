import type { Address, Hash, Hex, Transaction, TransactionReceipt } from "viem";
import type { Asset } from "~/features/assets";

export interface BaseTransaction {
  data?: Hex;
  from: Address;
  to: Address;
  value?: bigint;
  asset: Asset;
}

export type TransactionRequest = BaseTransaction;

export interface PendingTransaction extends BaseTransaction {
  id: string;
  paymasterApproveHash: Hash | null;
  transactionHash: Hash | null;
}

export type CompletedTransaction = Omit<Transaction, "to"> &
  Pick<TransactionReceipt, "status"> & {
    to: Address;
    asset: Asset;
  };
