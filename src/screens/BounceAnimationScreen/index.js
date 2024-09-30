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
  {
    title: "Bounce(In/Out)Left",
    typeEntry: () => new BounceInLeft(),
    typeExit: () => new BounceOutLeft(),
  },
  {
    title: "Bounce(In/Out)Right",
    typeEntry: () => new BounceInRight(),
    typeExit: () => new BounceOutRight(),
  },
  {
    title: "Bounce(In/Out)Up",
    typeEntry: () => new BounceInUp(),
    typeExit: () => new BounceOutUp(),
  },
  {
    title: "Bounce(In/Out)Down",
    typeEntry: () => new BounceInDown(),
    typeExit: () => new BounceOutDown(),
  },
  {
    title: "Bounce(In/Out)",
    typeEntry: () => new BounceIn(),
    typeExit: () => new BounceOut(),
  },
];

const BounceAnimationScreen = () => {
  const [animationTypeEntry, setAnimationTypeEntry] = useState(null);
  const [animationTypeExit, setAnimationTypeExit] = useState(null);
  const [visible, setVisible] = useState(true);
  const { colors } = useTheme();
  const styles = createStyle(colors);

  const handleAnimation = (param) => {
    setVisible(false);
    setTimeout(() => {
      setAnimationTypeEntry(param?.typeEntry());
      setTimeout(() => {
        setAnimationTypeExit(param?.typeExit());
      }, 400);
      setVisible(true);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.animationContainer}>
        {visible && (
          <Animated.View
            style={styles.animatedContainer}
            entering={animationTypeEntry}
            exiting={animationTypeExit}
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
            onPress={() => handleAnimation(item)}
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
      backgroundColor: colors.backgroundColor,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.borderColor,
    },
    animationTitle: {
      ...typography.fontStyles.nunitoSemiBold,
      color: colors.text,
    },
    buttonContainer: {
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "space-around",
      gap: 20,
    },
    button: {
      height: normalize(45),
      backgroundColor: colors.backgroundColor,
      minWidth: "42%",
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    title: {
      ...typography.fontStyles.nunitoBold,
      color: colors.text,
    },
  });
