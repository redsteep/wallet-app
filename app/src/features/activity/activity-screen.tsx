import { useIsFocused } from "@react-navigation/native";
import Animated, { FadeInUp, FadeOut, Layout } from "react-native-reanimated";
import { Spinner, Text, XStack, YStack } from "tamagui";
import { FadingScrollView } from "~/components/fading-scroll-view";
import { NoActivity } from "~/features/activity/components/no-activity";
import { TransactionActivity } from "~/features/activity/components/transaction-activity";
import { useTransactions } from "~/features/transactions";

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

export function ActivityScreen() {
  // NOTE: Updating root view key on focus because otherwise layout animations break
  // unless new activity gets appended while this screen is in focus (which is never gonna happen)
  const isFocused = useIsFocused();

  const { pending, completed } = useTransactions((state) => state.transactions);
  const hasAnyTransactions = pending.length > 0 || completed.length > 0;

  if (!hasAnyTransactions) {
    return <NoActivity />;
  }

  return (
    <FadingScrollView>
      <AnimatedYStack
        key={String(isFocused)}
        flex={1}
        paddingHorizontal="$4"
        paddingBottom="$4"
        space="$4"
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
              <TransactionActivity key={tx.id} transaction={tx} />
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
              <TransactionActivity key={tx.hash} transaction={tx} />
            ))}
          </AnimatedYStack>
        )}
      </AnimatedYStack>
    </FadingScrollView>
  );
}
