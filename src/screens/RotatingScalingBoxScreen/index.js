import { useTheme } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { normalize } from "../../theme";

const RotatingScalingBoxScreen = () => {
  const rotation = useSharedValue(0); // Starts at 0 degrees
  const scale = useSharedValue(0.1); // Starts small
  const { colors } = useTheme();
  const styles = createStyle(colors);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  useEffect(() => {
    // Trigger rotation and scale animations
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1200,
        easing: Easing.linear,
      }),
      -1, // Infinite repetition
      false // No reversal, continuous forward rotation
    );

    scale.value = withRepeat(
      withTiming(1, {
        duration: 1200,
        easing: Easing.inOut(Easing.linear),
      }),
      -1, // Infinite repetition
      true // Reverse the scale animation on each iteration
    );
  }, []); // Empty dependency array to ensure it runs only on mount

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedBoxContainer, animatedStyles]} />
    </View>
  );
};

export default RotatingScalingBoxScreen;

const createStyle = (colors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.backgroundColor,
    },
    animatedBoxContainer: {
      width: normalize(150),
      height: normalize(150),
      borderRadius: normalize(12),
      backgroundColor: colors.blue,
    },
  });
};
