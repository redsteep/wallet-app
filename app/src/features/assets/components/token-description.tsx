// import { LayoutChangeEvent, StyleSheet } from "react-native";
// import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
// import { Text, View } from "tamagui";

// interface TokenDescriptionProps {
//   description: string;
// }

// export function TokenDescription({ description }: TokenDescriptionProps) {
//   const containerHeight = useSharedValue(0);
//   const animatedHeight = useSharedValue(0);
//   const isExpanded = useSharedValue(false);

//   const handleLayout = (event: LayoutChangeEvent) => {
//     const onLayoutHeight = event.nativeEvent.layout.height;

//     if (onLayoutHeight > 0 && containerHeight.value !== onLayoutHeight) {
//       containerHeight.value = onLayoutHeight;
//       animatedHeight.value = onLayoutHeight * 0.35;
//     }
//   };

//   const collapsableStyle = useAnimatedStyle(() => {
//     return {
//       height: animatedHeight.value,
//       overflow: "hidden",
//     };
//   });

//   return (
//     <Animated.View style={collapsableStyle}>
//       <View position="absolute" onLayout={handleLayout}>
//         <Text
//           selectable
//           color="$color10"
//           fontSize="$5"
//           fontWeight="500"
//           letterSpacing={0.25}
//         >
//           {description}
//         </Text>
//       </View>
//     </Animated.View>
//   );
// }
