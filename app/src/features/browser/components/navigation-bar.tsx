import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState, type ElementRef } from "react";
import Animated, {
  FadeInLeft,
  FadeInRight,
  Layout,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import type WebView from "react-native-webview";
import { type WebViewNavigation } from "react-native-webview";
import { Button, Input, XStack, styled } from "tamagui";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { createGoogleSearchURL, createNormalizedURL } from "~/features/browser/url-utils";

const AnimatedInput = Animated.createAnimatedComponent(Input);
const AnimatedButton = Animated.createAnimatedComponent(Button);
const AnimatedXStack = Animated.createAnimatedComponent(XStack);

const NavigationButton = styled(AnimatedXStack, {
  width: "$3",
  height: "$3",
  alignItems: "center",
  justifyContent: "center",
  hoverStyle: { backgroundColor: "$backgroundHover" },
  pressStyle: { backgroundColor: "$backgroundPress" },
  borderRadius: "$12",

  variants: {
    disabled: {
      true: {
        disabled: true,
        opacity: 0.35,
      },
    },
  },

  defaultVariants: {
    disabled: false,
  },
});

interface NavigationBarProps {
  url?: URL;
  webViewRef: React.RefObject<WebView>;
  webViewState?: WebViewNavigation;
  onNavigate: (url: URL) => void;
}

export function NavigationBar({
  url,
  webViewRef,
  webViewState,
  onNavigate,
}: NavigationBarProps) {
  const inputRef = useRef<ElementRef<typeof Input>>(null);

  const [inputValue, setInputValue] = useState<string>();
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleOnSubmit = () => {
    if (inputValue) {
      onNavigate(createNormalizedURL(inputValue) ?? createGoogleSearchURL(inputValue));
    }
  };

  const handleOnFocus = () => {
    setInputValue(webViewState?.url);
    setIsInputFocused(true);
  };

  const handleOnBlur = () => {
    setIsInputFocused(false);
  };

  useFocusEffect(
    useCallback(() => {
      inputRef.current?.focus();
    }, []),
  );

  return (
    <SafeAreaStack
      flex={0}
      flexDirection="row"
      alignItems="center"
      marginVertical="$3"
      marginHorizontal="$4"
      edges={["top"]}
      space="$3"
    >
      {url && !isInputFocused && (
        <AnimatedXStack space="$1.5" exiting={SlideOutLeft}>
          <NavigationButton
            disabled={!webViewState?.canGoBack}
            onPress={() => webViewRef.current?.goBack()}
            entering={FadeInLeft.springify()
              .mass(0.15)
              .damping(8)
              .stiffness(60)
              .overshootClamping(1)}
          >
            <Ionicons name="arrow-back" size={24} />
          </NavigationButton>

          <NavigationButton
            disabled={!webViewState?.canGoForward}
            onPress={() => webViewRef.current?.goForward()}
            entering={FadeInLeft.delay(25)
              .springify()
              .mass(0.15)
              .damping(8)
              .stiffness(60)
              .overshootClamping(1)}
          >
            <Ionicons name="arrow-forward" size={24} />
          </NavigationButton>

          <NavigationButton
            onPress={() =>
              webViewState?.loading
                ? webViewRef.current?.stopLoading()
                : webViewRef.current?.reload()
            }
            entering={FadeInLeft.delay(50)
              .springify()
              .mass(0.15)
              .damping(8)
              .stiffness(60)
              .overshootClamping(1)}
          >
            <Ionicons name={webViewState?.loading ? "close" : "reload"} size={20} />
          </NavigationButton>
        </AnimatedXStack>
      )}

      <AnimatedInput
        ref={inputRef}
        flex={1}
        size="$4"
        fontSize="$6"
        fontWeight="600"
        inputMode="url"
        keyboardType="url"
        textContentType="URL"
        returnKeyType="go"
        placeholder="Search or Enter URL"
        autoCapitalize="none"
        autoCorrect={false}
        selectTextOnFocus={true}
        textAlign={isInputFocused ? "left" : "center"}
        value={isInputFocused ? inputValue : url?.hostname}
        onChangeText={setInputValue}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onSubmitEditing={handleOnSubmit}
        layout={Layout.springify()
          .mass(0.15)
          .damping(8)
          .stiffness(60)
          .overshootClamping(1)}
      />

      {isInputFocused && (
        <AnimatedButton
          size="$4"
          transparent
          onPress={() => inputRef.current?.blur()}
          entering={FadeInRight.springify()
            .mass(0.15)
            .damping(8)
            .stiffness(60)
            .overshootClamping(1)}
          exiting={SlideOutRight}
        >
          <Button.Text fontSize="$6" fontWeight="600">
            Cancel
          </Button.Text>
        </AnimatedButton>
      )}
    </SafeAreaStack>
  );
}
