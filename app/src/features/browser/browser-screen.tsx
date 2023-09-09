/* eslint-disable @typescript-eslint/no-explicit-any */

import { useFocusEffect } from "@react-navigation/native";
import { useRef, useState } from "react";
import { BackHandler, Platform } from "react-native";
import {
  WebView,
  type WebViewMessageEvent,
  type WebViewNavigation,
} from "react-native-webview";
import { type WebViewNavigationEvent } from "react-native-webview/lib/WebViewTypes";
import { YStack } from "tamagui";
import { useAccount } from "wagmi";
import { FadingScrollView } from "~/components/fading-scroll-view";
import { NavigationBar } from "~/features/browser/components/navigation-bar";
import { SuggestedDapps } from "~/features/browser/components/suggested-dapps";
import { type SmartAccountConnector } from "~/lib/smart-account-connector";

export function BrowserScreen() {
  const webViewRef = useRef<WebView>(null);

  const [currentUrl, setCurrentUrl] = useState<URL>();
  const [navigationState, setNavigationState] = useState<WebViewNavigation>();

  const { address, connector } = useAccount();

  const handleWebViewLoad = (event: WebViewNavigationEvent) => {
    setNavigationState(event.nativeEvent);

    if (webViewRef.current) {
      // TODO: Implement events
      webViewRef.current.injectJavaScript(`
        window.ethereum = {
          request: (message) => {
            const id = Date.now();

            window.ReactNativeWebView.postMessage(
              JSON.stringify(Object.assign(message, { id }))
            );

            return new Promise((resolve, reject) => {
              const listener = (event) => {
                if (event.data.id !== id) {
                  return;
                }

                window.removeEventListener('message', listener);

                if ('result' in event.data) {
                  resolve(event.data.result);
                } else {
                  reject(event.data.error || {
                    code: 4200,
                    message: "Unsupported method",
                  });
                }
              }

              window.addEventListener('message', listener);
            });
          },
          on: (eventName, listener) => {},
          removeListener: (eventName, listener) => {},
        };
        true;
      `);
    }
  };

  const handleWebViewMessage = async ({ nativeEvent }: WebViewMessageEvent) => {
    if (!nativeEvent.data) {
      return;
    }

    let data: {
      id: string;
      method: string;
      params: any;
    };

    try {
      data = JSON.parse(nativeEvent.data);
      console.debug("Message from WebView:", nativeEvent.data);
    } catch {
      console.warn(`Malformed message coming in from WebView: ${nativeEvent.url}`);
      return;
    }

    const respondWith = (result: any) => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          window.postMessage(${JSON.stringify({ id: data.id, result })});
          true;
        `);
      }
    };

    switch (data.method) {
      case "eth_requestAccounts":
      case "eth_accounts":
        return respondWith([address]);

      case "wallet_switchEthereumChain":
        return;

      default: {
        const smartAccountConnector = connector as SmartAccountConnector;
        const smartAccountProvider = await smartAccountConnector.getProvider();
        return respondWith(await smartAccountProvider.request(data));
      }
    }
  };

  useFocusEffect(() => {
    if (Platform.OS === "android") {
      const eventSubscription = BackHandler.addEventListener("hardwareBackPress", () => {
        if (!webViewRef.current || !navigationState?.canGoBack) {
          return false;
        }
        webViewRef.current.goBack();
        return true;
      });

      return () => {
        eventSubscription.remove();
      };
    }
  });

  return (
    <YStack flex={1} backgroundColor="$backgroundStrong">
      <NavigationBar
        url={currentUrl}
        webViewRef={webViewRef}
        navigationState={navigationState}
        onNavigate={setCurrentUrl}
      />

      {currentUrl ? (
        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl.toString() }}
          startInLoadingState
          pullToRefreshEnabled
          onLoad={handleWebViewLoad}
          onNavigationStateChange={setNavigationState}
          onMessage={handleWebViewMessage}
        />
      ) : (
        <FadingScrollView keyboardDismissMode="interactive">
          <SuggestedDapps onNavigate={setCurrentUrl} />
        </FadingScrollView>
      )}
    </YStack>
  );
}
