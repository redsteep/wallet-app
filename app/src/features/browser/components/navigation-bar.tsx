import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect, useRef, useState, type ElementRef, useCallback } from "react";
import Animated, {
  FadeInLeft,
  FadeInRight,
  Layout,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import type WebView from "react-native-webview";
import { type WebViewNavigation } from "react-native-webview";
import { Button, Input, XStack, styled, useTheme } from "tamagui";
import { SafeAreaStack } from "~/components/safe-area-stack";
import {
  createGoogleSearchURL,
  createNormalizedURL,
} from "~/features/browser/url-helper";

const AnimatedInput = Animated.createAnimatedComponent(Input);
const AnimatedButton = Animated.createAnimatedComponent(Button);
const AnimatedXStack = Animated.createAnimatedComponent(XStack);

const NavigationButton = styled(XStack, {
  width: "$3",
  height: "$3",

  alignItems: "center",
  justifyContent: "center",
  borderRadius: "$12",

  hoverStyle: { backgroundColor: "$backgroundHover" },
  pressStyle: { backgroundColor: "$backgroundPress" },

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
  navigationState?: WebViewNavigation;
  onNavigate: (url: URL) => void;
}

export function NavigationBar({
  url,
  webViewRef,
  navigationState,
  onNavigate,
}: NavigationBarProps) {
  const theme = useTheme();

  const inputRef = useRef<ElementRef<typeof Input>>(null);
  const [inputValue, setInputValue] = useState<string>();
  const [isInputFocused, setIsInputFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (typeof url !== "undefined") {
        inputRef.current?.blur();
      } else {
        inputRef.current?.focus();
      }
    }, [url]),
  );

  const handleOnSubmit = () => {
    if (inputValue) {
      onNavigate(createNormalizedURL(inputValue) ?? createGoogleSearchURL(inputValue));
    }
  };

  const handleOnFocus = () => {
    setInputValue(navigationState?.url);
    setIsInputFocused(true);
  };

  const handleOnBlur = () => {
    setIsInputFocused(false);
  };

  return (
    <SafeAreaStack
      flex={0}
      flexDirection="row"
      alignItems="center"
      marginHorizontal="$4"
      marginVertical="$3"
      edges={["top"]}
      space="$3"
    >
      {url && !isInputFocused && (
        <AnimatedXStack
          space="$2"
          marginLeft="$-2"
          entering={FadeInLeft.springify()
            .mass(0.15)
            .damping(8)
            .stiffness(60)
            .overshootClamping(1)}
          exiting={SlideOutLeft}
        >
          <NavigationButton
            disabled={!navigationState?.canGoBack}
            onPress={() => webViewRef.current?.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} />
          </NavigationButton>

          <NavigationButton
            disabled={!navigationState?.canGoForward}
            onPress={() => webViewRef.current?.goForward()}
          >
            <MaterialCommunityIcons name="arrow-right" size={24} />
          </NavigationButton>

          <NavigationButton
            onPress={() =>
              navigationState?.loading
                ? webViewRef.current?.stopLoading()
                : webViewRef.current?.reload()
            }
          >
            <MaterialCommunityIcons
              name={navigationState?.loading ? "close" : "reload"}
              size={24}
            />
          </NavigationButton>
        </AnimatedXStack>
      )}

      <AnimatedInput
        ref={inputRef}
        flex={1}
        size="$4"
        fontSize="$6"
        fontWeight="600"
        textAlign={isInputFocused ? "left" : "center"}
        inputMode="url"
        keyboardType="url"
        textContentType="URL"
        returnKeyType="go"
        autoCorrect={false}
        autoCapitalize="none"
        selectTextOnFocus={true}
        selectionColor={theme.color6.get()}
        value={isInputFocused ? inputValue : url?.hostname}
        placeholder="Search or Enter URL"
        onChangeText={setInputValue}
        onSubmitEditing={handleOnSubmit}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
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
          onPress={() => {
            inputRef.current?.blur();
            setIsInputFocused(false);
          }}
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
