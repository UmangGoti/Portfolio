import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ic_arrow_left, ic_arrow_right } from "../../assets/images";
import { normalize } from "../../theme/index";

const { width, height } = Dimensions.get("screen");

const widthWithMargin = width;
const widthArray = [1, 2, 3, 4, 5].map((item, index) => {
  return (widthWithMargin - 30 * index) / (2.3 * (index + 1));
});
const agentNameTextHeight = 40;
var requestOptions = {
  method: "GET",
};

const DashboardAnimationScreen = () => {
  const [data, setData] = useState([]);

  const [count, setCount] = useState(0);

  const insets = useSafeAreaInsets();

  const { colors } = useTheme();

  const styles = createStyle(colors);

  // Shared `x` with initial value `0`
  const x = useSharedValue(0);

  // Shared `widthX` with initial value `0`
  const widthX = useSharedValue(0);

  // To manage scroll.
  const scrollViewRef = useAnimatedRef(null);

  useEffect(() => {
    _callApi();
  }, []);

  useEffect(() => {
    scrollViewRef.current.scrollTo({ x: width * x.value, y: 0 });
  }, [count]);

  //--Api Call
  const _callApi = () => {
    fetch("https://valorant-api.com/v1/agents", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.data) {
          let array = result.data.slice(0, 5);
          setData(array);
        }
      })
      .catch((error) => console.error("error", error));
  };
  //--End

  // Decrement the value of `x`, `widthX` & `count`
  const onPressLeftArrow = () => {
    if (x.value > 0 && x.value <= 5) {
      x.value = x.value - 1;
      widthX.value = withTiming(
        widthX.value - width,
        {},
        () => {},
        runOnJS(setCount)(count - 1)
      );
    }
  };

  // Increment the value of `x`, `widthX` & `count`
  const onPressRightArrow = () => {
    if (x.value < 4 && x.value >= 0) {
      x.value = x.value + 1;
      widthX.value = withTiming(
        widthX.value + width,
        {},
        () => {},
        runOnJS(setCount)(count + 1)
      );
    }
  };

  // Animated Style for Agent Name
  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            widthX.value,
            [-width, 0, width],
            [agentNameTextHeight, 0, -agentNameTextHeight]
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.nameContainer, { marginTop: insets.top }]}>
        <Animated.View style={textAnimatedStyle}>
          {data.map((item, index) => {
            return (
              <Text key={`Name - ${index}`} style={styles.agentNameText}>
                {item.displayName ? item.displayName.toUpperCase() : ""}
              </Text>
            );
          })}
        </Animated.View>
      </View>
      <Animated.ScrollView
        scrollEventThrottle={99}
        ref={scrollViewRef}
        decelerationRate="fast"
        snapToInterval={width}
        horizontal
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
      >
        {data.map((item, index) => {
          return (
            <View
              key={index}
              style={[
                styles.scrollContainer,
                { backgroundColor: `#${item.backgroundGradientColors[0]}` },
              ]}
            >
              <Image
                source={{ uri: item.background }}
                style={styles.backgroundImage}
                contentFit="contain"
              />
              <Image
                source={{ uri: item.fullPortrait }}
                style={styles.agentImage}
                contentFit="contain"
              />
            </View>
          );
        })}
      </Animated.ScrollView>
      <View
        style={[
          styles.bottomButtonContainer,
          { marginBottom: insets.bottom + normalize(15) },
        ]}
      >
        {widthArray.map((item, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            return {
              width:
                index - x.value < 0
                  ? withTiming(widthArray[widthArray.length - index - 1], {
                      duration: 500,
                      easing: Easing.linear,
                    })
                  : withTiming(widthArray[index - x.value], {
                      duration: 500,
                      easing: Easing.linear,
                    }),
            };
          }, [x]);
          return (
            <Animated.View
              style={[animatedStyle, styles.buttonContainer]}
              key={`AnimatedView - ${index}`}
            >
              {index === count ? (
                <View style={styles.arrowContainer}>
                  {index != 0 ? (
                    <TouchableOpacity onPress={onPressLeftArrow}>
                      <Image
                        source={ic_arrow_left}
                        style={styles.arrow}
                        contentFit="contain"
                      />
                    </TouchableOpacity>
                  ) : (
                    <View />
                  )}
                  {index != 4 ? (
                    <TouchableOpacity onPress={onPressRightArrow}>
                      <Image
                        source={ic_arrow_right}
                        style={styles.arrow}
                        contentFit="contain"
                      />
                    </TouchableOpacity>
                  ) : (
                    <View />
                  )}
                </View>
              ) : (
                <></>
              )}
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const createStyle = (colors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors?.background,
    },
    scrollContainer: {
      flex: 1,
      width: width,
      height: "100%",
    },
    backgroundImage: { width: "100%", height: "100%" },
    agentImage: {
      width: "100%",
      height: "100%",
      zIndex: 2,
      position: "absolute",
    },
    nameContainer: {
      height: agentNameTextHeight,
      zIndex: 2,
      position: "absolute",
      overflow: "hidden",
      marginLeft: width * 0.05,
    },
    agentNameText: {
      zIndex: 5,
      color: "white",
      fontSize: 40,
      lineHeight: 0,
      height: agentNameTextHeight,
      fontWeight: "bold",
    },
    bottomButtonContainer: {
      height: "6%",
      flexDirection: "row",
      justifyContent: "center",
      position: "absolute",
      bottom: 0,
      right: 0,
      left: 0,
    },
    buttonContainer: {
      height: 50,
      borderColor: "white",
      borderWidth: 2,
      borderRadius: 8,
      marginLeft: 2,
      marginRight: 2,
      justifyContent: "center",
      paddingLeft: 10,
      paddingRight: 10,
    },
    arrowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    arrow: {
      tintColor: "white",
      width: 25,
      height: 25,
    },
  });
};

export default DashboardAnimationScreen;
