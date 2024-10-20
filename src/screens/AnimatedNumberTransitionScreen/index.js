import {useTheme} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Spacing} from '../../components';
import usePrevious from '../../hooks/usePrevious';
import {
  colors,
  hexToRGBA,
  normalize,
  sizes,
  colors as tColors,
  typography,
} from '../../theme';
import Device from '../../utils/device';

const generateRandomNumber = () => Math.floor(Math.random() * 1000000);

const AnimatedNumberTransitionScreen = () => {
  const [number, setNumber] = useState(generateRandomNumber());
  const {colors} = useTheme();
  const styles = createStyle(colors);
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <AnimatedNumber
        number={String(number)}
        fontSize={120}
        isInvertedColor={true}
      />
      <Spacing size={40} />
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.button}
        onPress={() => setNumber(generateRandomNumber())}>
        <Text style={styles.title}>Generate Random number</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AnimatedNumberTransitionScreen;

const createStyle = colors => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: sizes.paddingHorizontal,
      justifyContent: 'center',
    },
    animatedBoxContainer: {
      width: normalize(200),
      height: normalize(200),
      borderRadius: normalize(12),
      backgroundColor: colors.blue,
    },
    button: {
      height: normalize(45),
      backgroundColor: colors.backgroundColor,
      minWidth: '90%',
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.borderColor,
      alignSelf: 'center',
    },
    title: {
      ...typography.fontStyles.nunitoBold,
      color: colors.text,
    },
  });
};

const AnimatedNumber = ({
  number = 0,
  fontSize = 30,
  isInvertedColor = false,
}) => {
  const [newFontSize, setNewFontSize] = useState(fontSize);
  const prevNumber = usePrevious(number);
  const numberInString = number.toString();
  const prevNumberInString = prevNumber.toString();

  const digits = useMemo(() => {
    LayoutAnimation.easeInEaseOut();
    return extractDigits(numberInString);
  }, [numberInString]);

  const prevDigits = useMemo(() => {
    return extractDigits(prevNumberInString);
  }, [prevNumberInString]);

  const translateYValues = useMemo(() => {
    return digits.map((_, index) => {
      const value = prevDigits[index];
      if (typeof value !== 'number') {
        return new Animated.Value(0);
      }

      const animationHeight = -1 * (newFontSize * value);
      return new Animated.Value(animationHeight);
    });
  }, [digits, prevDigits, newFontSize]);

  useEffect(() => {
    digits.forEach((digit, index) => {
      Animated.timing(translateYValues[index], {
        toValue: isNaN(digit) ? -1 * 0 : -1 * digit * newFontSize,
        duration: 500,
        easing: Easing.out(Easing.quad),
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    });
  }, [digits, newFontSize]);

  function extractDigits(num) {
    return num.split('').map(item => (isNaN(item) ? item : Number(item)));
  }

  return (
    <View>
      <Text
        style={[
          [
            {...styles.number, fontSize: fontSize},
            {
              position: 'absolute',
              transform: [
                {translateX: Device.getDeviceWidth() * 10000},
                {translateY: Device.getDeviceWidth() * 10000},
              ],
            },
          ],
        ]}
        onTextLayout={event => {
          const absolute = Math.abs(
            Math.abs(Math.ceil(event.nativeEvent.lines[0].ascender)),
          ).toFixed(0);
          setNewFontSize(Number(absolute));
        }}
        numberOfLines={1}
        adjustsFontSizeToFit={true}>
        {number}
      </Text>
      <View style={styles.container}>
        {digits.map((digit, index) => (
          <View
            key={`digit-${digit} index-${index}`}
            style={[styles.digitContainer, {height: newFontSize}]}>
            <Animated.View
              style={{
                transform: [{translateY: translateYValues[index]}],
                flex: 1,
              }}>
              {Array.from({length: 10}, (_, i) => (
                <Text
                  key={i}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  style={[
                    styles.number,
                    {
                      color: isInvertedColor
                        ? isNaN(digit)
                          ? hexToRGBA(tColors.dark.colors.appIcon, 0.3)
                          : hexToRGBA(tColors.dark.colors.appIcon, 1)
                        : colors.text,
                      fontSize: newFontSize,
                    },
                  ]}>
                  {isNaN(digit) ? digit : i}
                </Text>
              ))}
            </Animated.View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  digitContainer: {
    overflow: 'hidden',
    flex: 1,
  },
  number: {
    ...typography.fontStyles.nunitoBold,
    fontVariant: ['tabular-nums'],
    fontSize: 50,
  },
});
