import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TapGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  measure,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {normalize} from '../../theme';

const RippleButtonScreen = () => {
  const _ref = useAnimatedRef();
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const sharedRippleColor = useSharedValue(0);
  const rippleX = useSharedValue(0);
  const rippleY = useSharedValue(0);
  const {colors} = useTheme();
  const styles = createStyle(colors);
  const boxColor = [
    colors.red,
    colors.green,
    colors.blue,
    colors.cyan,
    colors.magenta,
    colors.yellow,
    colors.purple,
  ];

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      top: rippleY.value,
      left: rippleX.value,
      backgroundColor: sharedRippleColor.value,
      opacity: opacity.value,
      transform: [{scale: scale.value}],
    };
  });

  const tap = useAnimatedGestureHandler({
    onStart: event => {
      const layout = measure(_ref);
      const radius = Math.max(layout.width, layout.height);
      width.value = layout.width;
      height.value = layout.height;
      rippleX.value = event.x - radius / 2;
      rippleY.value = event.y - radius / 2;
      scale.value = 0;
      opacity.value = 0.8;
      scale.value = withTiming(5, {duration: 2000});
      sharedRippleColor.value = boxColor[Math.floor(Math.random() * 7)];
    },
    onActive: () => {},
    onFinish: () => {
      opacity.value = withTiming(0, {duration: 1000});
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.viewContainer]}>
        <TapGestureHandler onGestureEvent={tap}>
          <Animated.View ref={_ref} style={styles.animatedContainer}>
            <Animated.View
              style={[animatedStyles, {borderRadius: normalize(12)}]}
            />
          </Animated.View>
        </TapGestureHandler>
      </View>
    </View>
  );
};

export default RippleButtonScreen;

const createStyle = colors => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundColor,
    },
    animatedContainer: {
      flex: 1,
      overflow: 'hidden',
      borderRadius: normalize(12),
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewContainer: {
      width: normalize(200),
      height: normalize(200),
      borderRadius: normalize(12),
      backgroundColor: colors.white,
      shadowColor: colors.black,
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      borderWidth: 3,
      borderColor: colors.gray,
    },
    animatedBoxContainer: {
      width: normalize(50),
      height: normalize(50),
      borderRadius: normalize(12),
      backgroundColor: colors.blue,
    },
  });
};
