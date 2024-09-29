import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Circle, G, Svg } from "react-native-svg";
import { normalize } from "../../theme";

const SVG_WIDTH = normalize(60);
const SVG_HEIGHT = normalize(60);
const STROKE_WIDTH = normalize(3.5);
const CENTER_OFF_CIRCLE = SVG_HEIGHT / 2;
const CIRCLE_RADIUS = SVG_HEIGHT / 2 - STROKE_WIDTH;
const circumference = 2 * Math.PI * CIRCLE_RADIUS;

const RandomCircularProgressBarScreen = () => {
  const { colors: _colors } = useTheme();
  const styles = createStyle(_colors);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const colors = [_colors.blue, _colors.magenta, _colors.purple, _colors.green];

  // Array to store animated values and their corresponding props
  const animatedStrokeDashoffsets = colors.map(() => useSharedValue(0));
  const animatedPropsArray = animatedStrokeDashoffsets.map((offset) =>
    useAnimatedProps(() => ({
      strokeDashoffset: offset.value,
    }))
  );

  const animateCircles = () => {
    animatedStrokeDashoffsets.forEach((offset) => {
      offset.value = withTiming(circumference * Math.random(), {
        duration: 500,
        easing: Easing.linear,
      });
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={animateCircles} activeOpacity={1}>
        <View style={styles.svgViewContainer}>
          {colors.map((circleColor, index) => (
            <Svg
              key={index}
              width={SVG_WIDTH}
              height={SVG_HEIGHT}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              fill={"transparent"}
              stroke={2}
            >
              <G
                rotation={"-90"}
                origin={`${SVG_HEIGHT / 2}, ${SVG_HEIGHT / 2}`}
              >
                <BackgroundCircle colors={_colors} />
                <AnimatedCircle
                  animatedProps={animatedPropsArray[index]}
                  cx={"50%"}
                  cy={"50%"}
                  fill={colors.transparent}
                  r={CIRCLE_RADIUS}
                  strokeWidth={STROKE_WIDTH}
                  stroke={circleColor}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                />
              </G>
            </Svg>
          ))}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const BackgroundCircle = ({ colors }) => (
  <Circle
    cx={CENTER_OFF_CIRCLE}
    cy={CENTER_OFF_CIRCLE}
    fill={colors.transparent}
    r={CIRCLE_RADIUS}
    strokeWidth={STROKE_WIDTH}
    stroke={colors?.white}
    strokeLinecap="round"
    strokeDasharray={circumference}
  />
);

export default RandomCircularProgressBarScreen;

const createStyle = (colors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    svgViewContainer: {
      backgroundColor: "#4bb6e8",
      borderRadius: normalize(12),
      width: normalize(320),
      height: normalize(90),
      alignItems: "center",
      justifyContent: "space-evenly",
      flexDirection: "row",
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: normalize(12),
      elevation: 2,
      shadowColor: colors.black,
    },
  });
};
