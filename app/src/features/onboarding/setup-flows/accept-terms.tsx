import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Stack, Text, Theme, YStack } from "tamagui";
import { z } from "zod";
import { CheckboxWithLabel } from "~/features/onboarding/components/checkbox-with-label";

const schema = z.object({
  responsibility: z.boolean(),
  betaNotice: z.boolean(),
});

export function AcceptTermsFlow({ goNext }: { goNext: () => void }) {
  const { control, watch } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      responsibility: false,
      betaNotice: false,
    },
  });

  const fieldValues = watch();
  const hasAcceptedTerms = Object.values(fieldValues).every((value) => value);

  return (
    <Stack flex={1} justifyContent="space-between" space="$4">
      <YStack space="$3">
        <Text fontSize="$8" fontWeight="700">
          Accept Terms
        </Text>
        <Text color="$color10" fontSize="$5" fontWeight="500">
          Please read and agree to the following terms before you continue.
        </Text>
      </YStack>

      <YStack space="$6">
        <CheckboxWithLabel
          name="responsibility"
          control={control}
          text="I understand that I am solely responsible for the security of my wallets."
        />
        <CheckboxWithLabel
          name="betaNotice"
          control={control}
          text="I understand that this software is still in development and that I may encounter occassional bugs."
        />
      </YStack>

      <Theme name="dark">
        <Button
          size="$4"
          opacity={hasAcceptedTerms ? 1.0 : 0.75}
          disabled={!hasAcceptedTerms}
          onPress={goNext}
        >
          <Button.Text fontSize="$6" fontWeight="500">
            I Understand, Continue
          </Button.Text>
        </Button>
      </Theme>
    </Stack>
  );
}
