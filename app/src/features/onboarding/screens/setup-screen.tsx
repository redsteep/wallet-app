import { isEnrolledAsync } from "expo-local-authentication";
import { useMemo, useState } from "react";
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useQuery } from "react-query";
import { Stack, Text, XStack, YStack } from "tamagui";
import { SafeAreaStack } from "~/components/safe-area-stack";
import { AcceptTermsFlow } from "~/features/onboarding/steps/accept-terms";
import { EnableBiometricsFlow } from "~/features/onboarding/steps/enable-biometrics";
import { useUserPreferences } from "~/lib/user-preferences";
import { usePrevious } from "~/utils/hooks/use-previous";

const flows = {
  acceptTerms: AcceptTermsFlow,
  enableBiometrics: EnableBiometricsFlow,
};

export function SetupScreen() {
  const { setFinishedOnboarding } = useUserPreferences((state) => state.actions);
  const { data: biometricsEnrolled } = useQuery("biometrics-enrolled", isEnrolledAsync);

  const enabledFlows = useMemo(
    () =>
      Object.entries(flows)
        .filter(([key]) => (biometricsEnrolled ? true : key !== "enableBiometrics"))
        .flatMap(([_, flow]) => flow),
    [biometricsEnrolled],
  );

  const [currentFlow, setCurrentFlow] = useState(0);
  const previousFlow = usePrevious(currentFlow);
  const setupProgress = currentFlow / (enabledFlows.length - 1);

  const CurrentFlowComponent = useMemo(() => enabledFlows[currentFlow], [currentFlow]);

  const goNext = () => {
    if (currentFlow < enabledFlows.length - 1) {
      setCurrentFlow(currentFlow + 1);
    } else {
      setFinishedOnboarding(true);
    }
  };

  const goBack = () => {
    if (currentFlow > 0) {
      setCurrentFlow(currentFlow - 1);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: `${setupProgress * 100}%`,
    height: 5,
    backgroundColor: "black",
  }));

  return (
    <SafeAreaStack alignItems="center" backgroundColor="$backgroundStrong" padding="$4">
      {/* {currentFlow > 0 && (
        <Pressable onPress={goBack}>
          <Ionicons name="arrow-back" size={28} />
        </Pressable>
      )} */}

      <XStack justifyContent="space-between" space="$4" paddingBottom="$6">
        <YStack flex={1} space="$3">
          <Stack
            position="relative"
            width="100%"
            height={5}
            backgroundColor="$color5"
            borderRadius="$8"
            overflow="hidden"
          >
            <Animated.View style={animatedStyle} />
          </Stack>

          <Animated.View
            key={currentFlow}
            entering={
              typeof previousFlow !== "undefined"
                ? currentFlow > previousFlow
                  ? FadeInRight.duration(150)
                  : FadeInLeft.duration(150)
                : undefined
            }
            exiting={
              currentFlow > (previousFlow ?? 0)
                ? FadeOutRight.duration(150)
                : FadeOutLeft.duration(150)
            }
          >
            <Text fontSize="$7" fontWeight="600">
              {currentFlow < enabledFlows.length - 1
                ? `Step ${currentFlow + 1} / ${enabledFlows.length}`
                : "One more thing.."}
            </Text>
          </Animated.View>
        </YStack>
      </XStack>

      <Animated.View
        key={currentFlow}
        style={{ flex: 1, width: "100%" }}
        entering={
          typeof previousFlow !== "undefined"
            ? currentFlow >= previousFlow
              ? FadeInRight.duration(150)
              : FadeInLeft.duration(150)
            : undefined
        }
        exiting={
          currentFlow > (previousFlow ?? 0)
            ? FadeOutRight.duration(150)
            : FadeOutLeft.duration(150)
        }
      >
        <CurrentFlowComponent goNext={goNext} />
      </Animated.View>
    </SafeAreaStack>
  );
}
