import Ionicons from "@expo/vector-icons/Ionicons";
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
          <Checkbox id={name} size="$5" checked={value} onCheckedChange={onChange}>
            <Checkbox.Indicator>
              <Ionicons name="checkmark" size={18} />
            </Checkbox.Indicator>
          </Checkbox>

          <Label
            width="75%"
            fontSize="$5"
            fontWeight="500"
            lineHeight={18}
            htmlFor={name}
          >
            {text}
          </Label>
        </XStack>
      )}
    />
  );
}
