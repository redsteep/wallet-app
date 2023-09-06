import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useRef, useState } from "react";
import {
  WebView,
  WebViewMessageEvent,
  type WebViewNavigation,
} from "react-native-webview";
import { Button, Input, XStack } from "tamagui";
import { zeroAddress } from "viem";
import { useAccount, useConnect } from "wagmi";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { SmartAccountConnector } from "~/lib/smart-account-connector";
import { TabScreenProps } from "~/navigation/navigators/app-navigator";

export function DappBrowserScreen({ route }: TabScreenProps<"Browser">) {
  const { address, connector } = useAccount();

  const webViewRef = useRef<WebView>(null);

  const [uri, setUri] = useState("https://app.uniswap.org");
  const [navigationState, setNavigationState] = useState<WebViewNavigation>();

  const handleWebViewLoad = useCallback(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        window.ethereum = {
          request: function (message) {
            const id = Date.now();
            const payload = Object.assign(message, { id });

            window.ReactNativeWebView.postMessage(JSON.stringify(payload));

            return new Promise((resolve) => {
              const listener = (event) => {
                if (event.data.id === id) {
                  window.removeEventListener('message', listener);
                  resolve(event.data.result);
                }
              }
              window.addEventListener('message', listener);
            });
          },
          on: (eventName, listener) => {
            // document.addEventListener(eventName, listener);
          },
          removeListener: (eventName, listener) => {
            // document.removeEventListener(eventName, listener);
          },
        };
        true;
      `);
    }
  }, []);

  const handleConnect = useCallback(async (respondWith: (value: object) => void) => {
    // const { origin } = new URL(currentBrowserUrl.current);
    // const connectedWallet = connectedWallets?.[origin];

    // const mustConnect = connectedWallet?.publicKey !== wallet.publicKey.toBase58();

    // const account = accounts.find((account) =>
    //   account.address.equals(wallet.publicKey),
    // );

    const connectWallet = () => {
      // chrome.storage.local.set({
      //   connectedWallets: {
      //     ...connectedWallets,
      //     [origin]: {
      //       publicKey: wallet.publicKey.toBase58(),
      //       selector: account.selector,
      //       autoApprove: connectedWallet?.autoApprove ?? true,
      //     },
      //   },
      // });

      respondWith({
        method: "connected",
        params: {
          publicKey: zeroAddress,
          autoApprove: false,
          // autoApprove: connectedWallet?.autoApprove ?? true,
        },
      });
    };

    // const handleConfirmation = (buttonIndex) => {
    //   if (buttonIndex === 1) {
    //     connectWallet();
    //   } else {
    //     respondWith({ method: "disconnected" });
    //   }
    // };

    // if (mustConnect) {
    //   const walletAddress = wallet.publicKey.toBase58().slice(0, 16);
    //   const confirmationMessage =
    //     `${strings.connectWalletDialogQuestion}\n\n` +
    //     `${strings.wallet}: ${walletAddress}...\n\n` +
    //     strings.connectWalletDialogNotice;

    //   // FIXME: dwallet-wallet-adapter enforces a 10-second window to receive a response,
    //   // otherwise it just timeouts and rejects the entire wallet handshake process.
    //   navigator.notification.confirm(
    //     confirmationMessage,
    //     handleConfirmation,
    //     strings.appName,
    //     [strings.connect, strings.cancel],
    //   );
    // } else {
    //   connectWallet();
    // }

    connectWallet();
  }, []);

  const handleDisconnect = useCallback(async (respondWith: (value: object) => void) => {
    // const { origin } = new URL(currentBrowserUrl.current);

    // chrome.storage.local.get("connectedWallets", (result) => {
    //   delete result.connectedWallets[origin];
    //   chrome.storage.local.set({
    //     connectedWallets: result.connectedWallets,
    //   });
    // });

    respondWith({
      method: "disconnected",
    });
  }, []);

  const handleSignTransactions = useCallback(
    async (params: object, respondWith: (value: object) => void) => {
      const signTransactions = async () => {
        if ("message" in params) {
          // const message = Buffer.from(bs58.decode(params.message));
          // const signature = await wallet.createSignature(message);

          respondWith({
            result: {
              publicKey: zeroAddress,
              signature: "0x",
            },
          });
        } else if ("messages" in params) {
          // let signatures = [];

          // const messages = params.messages.map((message) =>
          //   Buffer.from(bs58.decode(message)),
          // );

          // if (wallet.type === "ledger") {
          //   for (const message of messages) {
          //     signatures.push(await wallet.createSignature(message));
          //   }
          // } else {
          //   signatures = await Promise.all(messages.map(wallet.createSignature));
          // }

          respondWith({
            result: {
              publicKey: zeroAddress,
              signatures: [],
            },
          });
        } else {
          throw new Error("Invalid payload");
        }
      };

      // const handleConfirmation = async (buttonIndex) => {
      //   if (buttonIndex === 1) {
      //     await signTransactions();
      //   } else {
      //     respondWith({ error: "Transaction cancelled" });
      //   }
      // };

      // const { origin } = new URL(currentBrowserUrl.current);
      // const connectedWallet = connectedWallets?.[origin];

      // if (!connectedWallet?.autoApprove) {
      //   const confirmationMessage =
      //     `${strings.allowTransactionDialogQuestion}\n\n` +
      //     `${strings.wallet}: ${wallet.publicKey.toBase58().slice(0, 16)}...`;

      //   navigator.notification.confirm(
      //     confirmationMessage,
      //     handleConfirmation,
      //     strings.appName,
      //     [strings.approve, strings.deny],
      //   );
      // } else {
      //   await signTransactions();
      // }

      await signTransactions();
    },
    [],
  );

  const handleWebViewMessage = useCallback(
    async ({ nativeEvent }: WebViewMessageEvent) => {
      console.debug("Message from WebView:", nativeEvent);

      // if (!wallet || !event?.data) {
      //   return;
      // }

      let data: {
        id: string;
        method: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: any;
      };

      try {
        data = JSON.parse(nativeEvent.data);
        console.log(nativeEvent.data);
      } catch {
        console.warn(`Malformed message coming in from WebView: ${nativeEvent.url}`);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const respondWith = (response: any) => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`
            window.postMessage(${JSON.stringify({ id: data.id, result: response })});
            true;
          `);
        }
      };

      switch (data.method) {
        case "eth_requestAccounts":
        case "eth_accounts":
          return respondWith([address]);

        case "connect":
          return await handleConnect(respondWith);

        case "disconnect":
          return await handleDisconnect(respondWith);

        default: {
          const smartAccountConnector = connector as SmartAccountConnector;
          const smartAccountProvider = await smartAccountConnector.getProvider();
          return respondWith(await smartAccountProvider.request(data));
        }
      }
    },
    [handleConnect, handleDisconnect, handleSignTransactions],
  );

  return (
    <SafeAreaStack backgroundColor="$backgroundStrong" edges={["top", "left", "right"]}>
      <XStack space="$2" padding="$2">
        <Button
          size="$3"
          onPress={() => webViewRef.current?.goBack()}
          opacity={navigationState?.canGoBack ? 1.0 : 0.35}
          disabled={!navigationState?.canGoBack}
        >
          <Ionicons name="arrow-back" size={18} />
        </Button>

        <Button
          size="$3"
          onPress={() => webViewRef.current?.goForward()}
          opacity={navigationState?.canGoForward ? 1.0 : 0.35}
          disabled={!navigationState?.canGoForward}
        >
          <Ionicons name="arrow-forward" size={18} />
        </Button>

        <Button size="$3" onPress={() => webViewRef.current?.reload()}>
          <Ionicons name="reload" size={18} />
        </Button>

        <Input flex={1} size="$3" value={navigationState?.url} />
      </XStack>

      <WebView
        ref={webViewRef}
        source={{ uri }}
        originWhitelist={["*"]}
        pullToRefreshEnabled
        automaticallyAdjustContentInsets={false}
        onLoad={handleWebViewLoad}
        onMessage={handleWebViewMessage}
        onNavigationStateChange={setNavigationState}
      />
    </SafeAreaStack>
  );
}
