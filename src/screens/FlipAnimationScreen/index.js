import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FlipInEasyX,
  FlipInEasyY,
  FlipInXDown,
  FlipInXUp,
  FlipInYLeft,
  FlipInYRight,
  FlipOutEasyX,
  FlipOutEasyY,
  FlipOutXDown,
  FlipOutXUp,
  FlipOutYLeft,
  FlipOutYRight,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Spacing } from "../../components";
import { normalize, sizes, typography } from "../../theme";

const data = [
  {
    title: "Flip(In/Out)XUp",
    typeEntry: () => new FlipInXUp(),
    typeExit: () => new FlipOutXUp(),
  },
  {
    title: "Flip(In/Out)YLeft",
    typeEntry: () => new FlipInYLeft(),
    typeExit: () => new FlipOutYLeft(),
  },
  {
    title: "Flip(In/Out)XDown",
    typeEntry: () => new FlipInXDown(),
    typeExit: () => new FlipOutXDown(),
  },
  {
    title: "Flip(In/Out)YRight",
    typeEntry: () => new FlipInYRight(),
    typeExit: () => new FlipOutYRight(),
  },
  {
    title: "Flip(In/Out)EasyX",
    typeEntry: () => new FlipInEasyX(),
    typeExit: () => new FlipOutEasyX(),
  },
  {
    title: "Flip(In/Out)EasyY",
    typeEntry: () => new FlipInEasyY(),
    typeExit: () => new FlipOutEasyY(),
  },
];

const FlipAnimationScreen = () => {
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

export default FlipAnimationScreen;

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
