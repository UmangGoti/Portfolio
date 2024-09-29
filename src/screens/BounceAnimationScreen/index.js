import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  BounceIn,
  BounceInDown,
  BounceInLeft,
  BounceInRight,
  BounceInUp,
  BounceOut,
  BounceOutDown,
  BounceOutLeft,
  BounceOutRight,
  BounceOutUp,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Spacing } from "../../components";
import { normalize, sizes, typography } from "../../theme";

const data = [
  { title: "BounceIn", type: () => new BounceIn() },
  { title: "BounceOut", type: () => new BounceOut() },
  { title: "BounceInLeft", type: () => new BounceInLeft() },
  { title: "BounceOutLeft", type: () => new BounceOutLeft() },
  { title: "BounceInRight", type: () => new BounceInRight() },
  { title: "BounceOutRight", type: () => new BounceOutRight() },
  { title: "BounceInUp", type: () => new BounceInUp() },
  { title: "BounceOutUp", type: () => new BounceOutUp() },
  { title: "BounceInDown", type: () => new BounceInDown() },
  { title: "BounceOutDown", type: () => new BounceOutDown() },
];

const BounceAnimationScreen = () => {
  const [animationType, setAnimationType] = useState(null);
  const [visible, setVisible] = useState(true);
  const { colors } = useTheme();
  const styles = createStyle(colors);

  const handleAnimation = (type) => {
    setVisible(false);
    setTimeout(() => {
      setAnimationType(type());
      setVisible(true);
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.animationContainer}>
        {visible && (
          <Animated.View
            style={styles.animatedContainer}
            entering={animationType}
          >
            <Text style={styles.animationTitle}>Animation Box</Text>
          </Animated.View>
        )}
      </View>
      <Spacing size={30} />
      <View style={styles.buttonContainer}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            style={styles.button}
            onPress={() => handleAnimation(item.type)}
          >
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default BounceAnimationScreen;

const createStyle = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
      paddingHorizontal: sizes.paddingHorizontal,
      justifyContent: "center",
      alignItems: "center",
    },
    animationContainer: {
      height: normalize(60),
      width: "100%",
      justifyContent: "center",
    },
    animatedContainer: {
      width: "100%",
      height: normalize(50),
      backgroundColor: "white",
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "black",
    },
    animationTitle: {
      ...typography.fontStyles.nunitoSemiBold,
    },
    buttonContainer: {
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "space-around",
      gap: 20,
    },
    button: {
      height: normalize(40),
      backgroundColor: "white",
      minWidth: "45%",
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "black",
    },
    title: {
      ...typography.fontStyles.nunitoBold,
      color: "black",
    },
  });
