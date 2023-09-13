import { nanoid } from "nanoid";
import { match, P } from "ts-pattern";
import {
  decodeEventLog,
  decodeFunctionData,
  encodeFunctionData,
  isAddressEqual,
  maxUint256,
} from "viem";
import { erc20ABI, type Address } from "wagmi";
import {
  fetchTransaction,
  readContract,
  sendTransaction,
  SendTransactionArgs,
  waitForTransaction,
  writeContract,
} from "wagmi/actions";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Asset } from "~/features/assets";
import type {
  CompletedTransaction,
  PendingTransaction,
  TransactionRequest,
} from "~/features/transactions/types";
import { PAYMASTER_ADDRESS, PAYMASTER_TOKEN_ADDRESS } from "~/lib/env-variables";
import { persistentZustandStorage } from "~/utils/persistent-zustand";

interface TransactionsState {
  transactions: {
    pending: PendingTransaction[];
    completed: CompletedTransaction[];
  };
  actions: {
    sendTransaction: (request: TransactionRequest) => Promise<void>;
    executeTransactionOperations: (transaction: PendingTransaction) => Promise<void>;

    approveTokenForPaymaster: (
      transaction: PendingTransaction,
    ) => Promise<PendingTransaction>;
    sendEthereumTransaction: (
      transaction: PendingTransaction,
    ) => Promise<PendingTransaction>;
    waitForTransactionReceipt: (transaction: PendingTransaction) => Promise<void>;
  };
}

export const useTransactions = create<TransactionsState>()(
  immer(
    persist(
      (set, get) =>
        <TransactionsState>{
          transactions: {
            pending: [],
            completed: [],
          },

          actions: {
            sendTransaction: async (request) => {
              const transaction: PendingTransaction = {
                ...request,
                id: nanoid(),
                paymasterApproveHash: null,
                transactionHash: null,
              };
              set((state) => {
                state.transactions.pending.push(transaction);
              });
              await get().actions.executeTransactionOperations(transaction);
            },

            executeTransactionOperations: async (transaction) => {
              const { actions } = get();

              const promises = match(transaction)
                .with({ paymasterApproveHash: P.nullish }, () => [
                  actions.approveTokenForPaymaster,
                  actions.sendEthereumTransaction,
                  actions.waitForTransactionReceipt,
                ])
                .with({ transactionHash: P.nullish }, () => [
                  actions.sendEthereumTransaction,
                  actions.waitForTransactionReceipt,
                ])
                .with({ transactionHash: P.string }, () => [
                  actions.waitForTransactionReceipt,
                ])
                .otherwise(() => []);

              for (const promise of promises) {
                try {
                  const updatedTransaction = await promise(transaction);
                  if (typeof updatedTransaction === "object") {
                    transaction = updatedTransaction;

                    set((state) => {
                      const index = state.transactions.pending.findIndex(
                        (tx) => tx.id === transaction.id,
                      );
                      if (index !== -1) {
                        state.transactions.pending[index] = updatedTransaction;
                      }
                    });
                  }
                } catch (error) {
                  set((state) => {
                    state.transactions.pending = state.transactions.pending.filter(
                      (tx) => tx.id !== transaction.id,
                    );
                  });
                  console.warn("Transaction failed:", error);
                  break;
                }
              }
            },

            approveTokenForPaymaster: async (transaction) => {
              const allowance = await readContract({
                abi: erc20ABI,
                address: PAYMASTER_TOKEN_ADDRESS as Address,
                functionName: "allowance",
                args: [transaction.from, PAYMASTER_ADDRESS as Address],
              });

              if (allowance <= 0n) {
                const { hash } = await writeContract({
                  abi: erc20ABI,
                  address: PAYMASTER_TOKEN_ADDRESS as Address,
                  functionName: "approve",
                  args: [PAYMASTER_ADDRESS as Address, maxUint256],
                });

                return {
                  ...transaction,
                  paymasterApproveHash: hash,
                };
              } else {
                return {
                  ...transaction,
                  paymasterApproveHash: "0x",
                };
              }
            },

            sendEthereumTransaction: async (transaction) => {
              console.debug(`Sending Ethereum transaction for ${transaction.id}`);

              const { hash } = await sendTransaction(
                match<PendingTransaction, SendTransactionArgs>(transaction)
                  .with({ asset: { type: "eth" } }, (request) => ({
                    from: request.from,
                    to: request.to,
                    value: request.value,
                  }))
                  .with(
                    { asset: { type: "erc20", tokenAddress: P.string } },
                    (request) => ({
                      from: request.from,
                      to: request.asset.tokenAddress,
                      data: request.data,
                    }),
                  )
                  .otherwise(() => {
                    throw new Error("Invalid asset");
                  }),
              );

              return {
                ...transaction,
                transactionHash: hash,
              };
            },

            waitForTransactionReceipt: async (transaction) => {
              if (!transaction.transactionHash) {
                throw new Error("Invalid stage");
              }

              console.debug(`Waiting for ${transaction.transactionHash}`);

              const receipt = await waitForTransaction({
                hash: transaction.transactionHash,
              });

              const completedTransaction: CompletedTransaction = {
                status: receipt.status,
                ...(await fetchTransaction({ hash: transaction.transactionHash })),
                ...transaction,
              };

              // for (const log of receipt.logs) {
              //   if (isAddressEqual(log.address, transaction.to)) {
              //     const topics = decodeEventLog({
              //       abi: erc20ABI,
              //       data: log.data,
              //       topics: log.topics,
              //     });

              //     if (topics.eventName === "Transfer") {
              //       completedTransaction = { ...completedTransaction, ...topics.args };
              //       break;
              //     }
              //   }
              // }

              set((state) => {
                state.transactions.completed.push(completedTransaction);
                state.transactions.pending = state.transactions.pending.filter(
                  (tx) => tx.id !== transaction.id,
                );
              });

              console.debug(
                `Complete transaction ${transaction.id}: ${completedTransaction.hash}`,
              );
            },
          },
        },
      {
        name: "transactions-state",
        version: 1.0,
        storage: createJSONStorage(() => persistentZustandStorage, {
          replacer: (_, value) => (typeof value === "bigint" ? `bn_${value}` : value),
          reviver: (_, value) =>
            typeof value === "string" && value.startsWith("bn_")
              ? BigInt(value.slice(3))
              : value,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            Promise.allSettled(
              state.transactions.pending.map((transaction) =>
                state.actions.executeTransactionOperations(transaction),
              ),
            ).catch((error) => {
              console.warn(`Couldn't restart pending transactions: ${error}`);
            });
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        partialize: ({ actions, ...rest }) => ({ ...rest }),
      },
    ),
  ),
);
