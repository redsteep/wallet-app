import { Text, XStack } from "tamagui";
import { P, match } from "ts-pattern";
import { commify } from "~/utils/commify";

interface TokenMarketStatProps {
  index: number;
  label: string;
  value: string | number;
  format?: "abbreviated" | "abbreviatedCurrency";
}

export function TokenMarketStat({ index, label, value, format }: TokenMarketStatProps) {
  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      backgroundColor={index % 2 !== 0 ? "$color2" : undefined}
      borderRadius="$4"
      padding="$2"
    >
      <Text fontSize="$6" fontWeight="500" color="$color10">
        {label}
      </Text>

      <Text fontSize="$6" fontWeight="500" letterSpacing={0.25}>
        {match([value, format])
          .with([P.number.select(), "abbreviated"], (value) => abbreviateNumber(value))
          .with(
            [P.number.select(), "abbreviatedCurrency"],
            (value) => `$${abbreviateNumber(value)}`,
          )
          .with([P.number.select(), P.nullish], (value) =>
            commify(Number(value).toFixed(0)),
          )
          .otherwise(() => value)}
      </Text>
    </XStack>
  );
}

function abbreviateNumber(num: number, decimals = 2) {
  const suffixes = ["", "k", "m", "b", "t"];
  const i = 0 === num ? num : Math.floor(Math.log(num) / Math.log(1000));
  const result = parseFloat((num / Math.pow(1000, i)).toFixed(decimals));
  return `${commify(result)}${suffixes[i] ?? ""}`;
}
