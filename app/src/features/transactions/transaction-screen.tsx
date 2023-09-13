// import { PanModal } from "@wallet/pan-modal";
// import { Image } from "expo-image";
// import { Pressable } from "react-native";
// import Animated, { LinearTransition } from "react-native-reanimated";
// import { Text, XStack, YStack } from "tamagui";
// import { match } from "ts-pattern";
// import { formatUnits, getAddress } from "viem";
// import { useAccount, useToken } from "wagmi";
// import { SafeAreaStack } from "~/components/safe-area-stack";
// import type {
//   CompletedTransaction,
//   PendingTransaction,
// } from "~/features/transactions/types";
// import { AppStackScreenProps } from "~/navigation/navigators/app-navigator";
// import { commify } from "~/utils/commify";
// import { shortenAddress } from "~/utils/shorten-address";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { useTransactions } from "~/features/transactions";

// export function TransactionScreen({
//   route,
//   navigation,
// }: AppStackScreenProps<"Transaction">) {
//   const { address } = useAccount();

//   const { data: token } = useToken({
//     address: transaction.asset.tokenAddress,
//   });

//   const status = "status" in transaction ? transaction.status : "pending";

//   const formattedUnits = parseFloat(
//     transaction.value && token ? formatUnits(transaction.value, token.decimals) : "0.0",
//   ).toFixed(4);

//   const formattedValue = `${commify(formattedUnits)} ${token?.symbol ?? "ETH"}`;

//   return (
//     <PanModal.Content>
//       <SafeAreaStack
//         flexDirection="column"
//         backgroundColor="$backgroundStrong"
//         padding="$4"
//       >
//         <XStack justifyContent="space-between" alignItems="center">
//           <Text fontSize="$8" fontWeight="700">
//             Transaction
//           </Text>

//           <Pressable onPress={() => navigation.goBack()}>
//             <Ionicons name="close" size={28} />
//           </Pressable>
//         </XStack>
//       </SafeAreaStack>
//     </PanModal.Content>
//   );
// }
