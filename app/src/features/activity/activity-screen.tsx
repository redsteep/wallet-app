import { useIsFocused } from "@react-navigation/native";
import Animated, { FadeInUp, FadeOut, Layout } from "react-native-reanimated";
import { Spinner, Text, XStack, YStack } from "tamagui";
import { FadingScrollView } from "~/components/fading-scroll-view";
import { NoActivity } from "~/features/activity/components/no-activity";
import { TransactionActivityEntry } from "~/features/activity/components/transaction-activity-entry";
import { useTransactions } from "~/features/transactions";

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

export function ActivityScreen() {
  const { pending, completed } = useTransactions((state) => state.transactions);

  const hasAnyTransactions = pending.length > 0 || completed.length > 0;
  const showTransactions = useIsFocused() && hasAnyTransactions;

  if (!hasAnyTransactions) {
    return <NoActivity />;
  }

  return (
    showTransactions && (
      <FadingScrollView>
        <AnimatedYStack
          flex={1}
          space="$4"
          paddingHorizontal="$4"
          exiting={FadeOut.delay(1000)}
        >
          {pending.length > 0 && (
            <AnimatedYStack
              space="$4"
              entering={FadeInUp.springify()
                .mass(0.15)
                .damping(8)
                .stiffness(60)
                .overshootClamping(1)}
              exiting={FadeOut.springify()
                .mass(0.15)
                .damping(8)
                .stiffness(60)
                .overshootClamping(1)}
            >
              <XStack space="$3">
                <Text fontSize="$6" fontWeight="600">
                  Pending
                </Text>
                <Spinner />
              </XStack>

              {pending.map((tx) => (
                <TransactionActivityEntry key={tx.id} transaction={tx} />
              ))}
            </AnimatedYStack>
          )}

          {completed.length > 0 && (
            <AnimatedYStack
              space="$4"
              layout={Layout.springify()
                .mass(0.15)
                .damping(8)
                .stiffness(60)
                .overshootClamping(1)}
            >
              <Text fontSize="$6" fontWeight="600">
                Complete
              </Text>

              {[...completed].reverse().map((tx) => (
                <TransactionActivityEntry key={tx.hash} transaction={tx} />
              ))}
            </AnimatedYStack>
          )}
        </AnimatedYStack>
      </FadingScrollView>
    )
  );
}
