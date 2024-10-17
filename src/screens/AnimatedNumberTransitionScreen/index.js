import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {normalize, typography} from '../../theme';
import Device from '../../utils/device';

const AnimatedNumberTransitionScreen = () => {
  const {colors} = useTheme();
  const styles = createStyle(colors);
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <AnimatedNumber number={'$121045465.48812'} />
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
  const [layoutHeight, setLayoutHeight] = useState(digitHeight);
  const [prevDigits, setPrevDigits] = useState([]);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    const newDigits = extractDigits(number);
    setDigits(newDigits);

    const newTranslateYValues = newDigits.map((digit, i) =>
      isFirstRender
        ? new Animated.Value(-layoutHeight * 10)
        : translateYValues[i] || new Animated.Value(0),
    );

    // Handle removal of excess translateYValues if number shrinks
    if (newTranslateYValues.length > newDigits.length) {
      newTranslateYValues.length = newDigits.length;
    }

    LayoutAnimation.easeInEaseOut();
    setTranslateYValues(newTranslateYValues);
    setPrevDigits(digits);
  }, [number]);

  useEffect(() => {
    digits.forEach((digit, index) => {
      if (isNaN(digit)) {
        return;
      }

      const prevDigit = prevDigits[index] ?? digit;
      const startValue = isFirstRender
        ? -10 * layoutHeight
        : -prevDigit * layoutHeight;
      const endValue = -digit * layoutHeight;
      translateYValues[index].setValue(startValue || 0);

      Animated.timing(translateYValues[index], {
        toValue: endValue,
        duration: 200,
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
            fontSize: digitHeight ? digitHeight : 30,
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
                  fontSize: digitHeight ? digitHeight : 30,
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
                      fontSize: digitHeight ? digitHeight : 30,
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
