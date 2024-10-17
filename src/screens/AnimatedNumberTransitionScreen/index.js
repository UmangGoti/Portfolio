import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fontPixel, normalize, typography} from '../../theme';
import Device from '../../utils/device';

const AnimatedNumberTransitionScreen = () => {
  const {colors} = useTheme();
  const styles = createStyle(colors);
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <AnimatedNumber number={'$464465421546.5465'} />
    </SafeAreaView>
  );
};

export default AnimatedNumberTransitionScreen;

const createStyle = colors => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    animatedBoxContainer: {
      width: normalize(200),
      height: normalize(200),
      borderRadius: normalize(12),
      backgroundColor: colors.blue,
    },
  });
};

const AnimatedNumber = ({number, digitHeight = 20}) => {
  // Function to preprocess the number and extract digits
  const [digits, setDigits] = useState([]);
  const [translateYValues, setTranslateYValues] = useState([]);
  const [layoutHeight, setLayoutHeight] = useState(fontPixel(digitHeight));

  useEffect(() => {
    const newDigits = extractDigits(number);
    setDigits(newDigits);

    const newTranslateYValues = newDigits.map(() => new Animated.Value(0));
    setTranslateYValues(newTranslateYValues);
  }, [number]);

  useEffect(() => {
    digits.forEach((digit, index) => {
      if (isNaN(digit)) {
        return;
      }

      Animated.timing(translateYValues[index], {
        toValue: -digit * layoutHeight,
        duration: 500,
        easing: Easing.out(Easing.quad),
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, [digits, translateYValues, layoutHeight]);

  const extractDigits = num => {
    return num.split('').map(item => (isNaN(item) ? item : Number(item)));
  };

  return (
    <View style={styles.container}>
      <Text
        onLayout={event => {
          setLayoutHeight(event.nativeEvent.layout.height);
        }}
        style={[
          styles.number,
          {
            fontSize: digitHeight ? fontPixel(digitHeight) : fontPixel(30),
            position: 'absolute',
            transform: [
              {translateX: Device.getDeviceWidth() * 1000},
              {translateY: Device.getDeviceHeight() * 1000},
            ],
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit={true}>
        {number}
      </Text>
      {digits.map((digit, index) => (
        <View
          key={index}
          style={[styles.digitContainer, {height: layoutHeight}]}>
          {isNaN(digit) ? (
            <Text
              key={index}
              style={[
                styles.number,
                {
                  fontSize: digitHeight
                    ? fontPixel(digitHeight)
                    : fontPixel(30),
                },
              ]}>
              {digit}
            </Text>
          ) : (
            <Animated.View
              style={{
                transform: [{translateY: translateYValues[index]}],
              }}>
              {Array.from({length: 10}, (_, i) => (
                <Text
                  key={i}
                  style={[
                    styles.number,
                    {
                      fontSize: digitHeight
                        ? fontPixel(digitHeight)
                        : fontPixel(30),
                    },
                  ]}>
                  {i}
                </Text>
              ))}
            </Animated.View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  digitContainer: {
    overflow: 'hidden',
  },
  number: {
    ...typography.fontStyles.nunitoBold,
    fontVariant: ['tabular-nums'],
  },
});
