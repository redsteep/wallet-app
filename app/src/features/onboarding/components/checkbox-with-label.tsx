import Ionicons from "@expo/vector-icons/Ionicons";
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Checkbox, Label, XStack } from "tamagui";

export function CheckboxWithLabel<T extends FieldValues>({
  name,
  control,
  text,
}: {
  name: FieldPath<T>;
  control: Control<T>;
  text: string;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <XStack space="$3">
          <Checkbox
            id={name}
            size="$6"
            checked={value}
            onCheckedChange={(event) => {
              impactAsync(ImpactFeedbackStyle.Medium);
              onChange(event);
            }}
          >
            <Checkbox.Indicator>
              <Ionicons name="checkmark-sharp" size={24} />
            </Checkbox.Indicator>
          </Checkbox>

          <Label width="75%" fontSize="$6" fontWeight="500" htmlFor={name} unstyled>
            {text}
          </Label>
        </XStack>
      )}
    />
  );
}
