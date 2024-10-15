import {useTheme} from '@react-navigation/native';
import React, {useCallback, useImperativeHandle, useState} from 'react';
import {Dimensions, Modal, StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Spacing} from '../components';
import {normalize} from '../theme';
import {sleep} from '../utils/helper';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const BottomSheet = React.forwardRef(({children}, ref) => {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const translateY = useSharedValue(0);
  const active = useSharedValue(false);
  const {colors} = useTheme();
  const styles = createStyle(colors);
  const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + insets.top;

  const scrollTo = useCallback(destination => {
    'worklet';
    active.value = destination !== 0;

    translateY.value = withSpring(destination, {damping: 15});
  }, []);

  const isActive = useCallback(() => {
    return active.value;
  }, []);

  const show = useCallback((data = -500) => {
    setVisible(true);
    scrollTo(data);
  }, []);

  const hide = useCallback(async (data = 0) => {
    scrollTo(data);
    await sleep(200);
    setVisible(false);
  }, []);

  useImperativeHandle(ref, () => ({show, hide, isActive}), [
    show,
    hide,
    isActive,
  ]);

  const context = useSharedValue({y: 0});
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {y: translateY.value};
    })
    .onUpdate(event => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 1.5) {
        runOnJS(hide)(0);
      }
    });

  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active.value ? 1 : 0),
    };
  }, []);

  const backdropProps = useAnimatedProps(() => {
    return {
      pointerEvents: active.value ? 'auto' : 'none',
    };
  }, []);

  // Calculate the height based on translateY value
  const dynamicHeightStyle = useAnimatedStyle(() => {
    const visibleHeight = Math.abs(translateY.value); // Calculate visible height
    return {
      height: visibleHeight - insets.bottom, // Set height based on visible portion
    };
  });

  return (
    <Modal visible={visible} transparent>
      <Animated.View
        onTouchStart={() => {
          runOnJS(hide)(0);
        }}
        animatedProps={backdropProps}
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.bottomSheet.overlay,
          },
          backdropStyle,
        ]}
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, bottomSheetStyle]}>
          <View style={styles.pan} />
          <Spacing
            size={2}
            style={{backgroundColor: colors.bottomSheet.dividerColor}}
          />
          <Animated.View style={dynamicHeightStyle}>{children}</Animated.View>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
});

const createStyle = colors =>
  StyleSheet.create({
    bottomSheetContainer: {
      height: SCREEN_HEIGHT,
      width: '100%',
      backgroundColor: colors.bottomSheet.backgroundColor,
      position: 'absolute',
      top: SCREEN_HEIGHT,
      borderRadius: 18,
    },
    pan: {
      width: normalize(40),
      height: normalize(4),
      backgroundColor: 'grey',
      alignSelf: 'center',
      marginVertical: 15,
      borderRadius: 2,
    },
  });

export default BottomSheet;
