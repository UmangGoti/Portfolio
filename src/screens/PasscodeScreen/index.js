import {useTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ic_backspace} from '../../assets/images';
import {colors, fontPixel, normalize, sizes, typography} from '../../theme';
import Device from '../../utils/device';

const steps = {
  1: {
    title: 'Enter New Passcode',
  },
  2: {
    title: 'Confirm Passcode',
  },
};

const DotIndicator = ({isFilled, animatedStyle}) => {
  const {colors: _colors} = useTheme();
  let styles = createStyle(_colors);
  return (
    <Animated.View
      style={[
        styles.dot,
        animatedStyle,
        isFilled && {backgroundColor: colors.dark.colors.blue},
      ]}
    />
  );
};

const KeypadButton = ({digit, onPress}) => {
  const {colors: _colors} = useTheme();
  let styles = createStyle(_colors);
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[
        styles.key,
        {
          backgroundColor:
            digit === '' ? colors.primaryBg : 'rgba(28, 28, 30, 1)',
        },
      ]}
      disabled={digit === ''}
      onPress={onPress}>
      {digit === 'erase' ? (
        <Image source={ic_backspace} style={styles.key} resizeMode="contain" />
      ) : (
        <Text style={styles.digit}>{digit}</Text>
      )}
    </TouchableOpacity>
  );
};

const PasscodeScreen = () => {
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [step, setStep] = useState(1);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const inputDotScale = useSharedValue(1);
  const shakeAnimation = useSharedValue(0);
  const {colors: _colors} = useTheme();
  let styles = createStyle(_colors);

  useEffect(() => {
    let transitionTimer;

    if (newPasscode.length === 6 && confirmPasscode.length < 6) {
      setWrongAttempt(false);
      transitionTimer = setTimeout(() => setStep(2), 500);
    } else if (newPasscode.length === 6 && confirmPasscode.length === 6) {
      if (newPasscode === confirmPasscode) {
        alert('New Passcode created.');
        transitionTimer = setTimeout(resetPasscode, 500);
      } else {
        setWrongAttempt(true);
        triggerShakeAnimation();
        transitionTimer = setTimeout(() => {
          setWrongAttempt(false);
          setConfirmPasscode('');
        }, 500);
      }
    }

    return () => clearTimeout(transitionTimer);
  }, [newPasscode, confirmPasscode, resetPasscode]);

  const resetPasscode = useCallback(() => {
    setNewPasscode('');
    setConfirmPasscode('');
    setStep(1);
    setWrongAttempt(false);
  }, []);

  const triggerShakeAnimation = () => {
    shakeAnimation.value = withSequence(
      withTiming(-10, {duration: 50}),
      withTiming(10, {duration: 50}),
      withTiming(-10, {duration: 50}),
      withTiming(10, {duration: 50}),
      withTiming(0, {duration: 50}),
    );
  };

  const handleKeyPress = digit => {
    if (step === 1 && newPasscode.length < 6) {
      setNewPasscode(prev => prev + digit);
      scaleDot();
    } else if (step === 2 && confirmPasscode.length < 6) {
      setConfirmPasscode(prev => prev + digit);
      scaleDot();
    }
  };

  const scaleDot = () => {
    inputDotScale.value = withTiming(
      1.2,
      {duration: 150, easing: Easing.inOut(Easing.ease)},
      () => {
        inputDotScale.value = withTiming(1, {duration: 150});
      },
    );
  };

  const handleDelete = () => {
    if (step === 1) {
      setNewPasscode(prev => prev.slice(0, -1));
    } else {
      setConfirmPasscode(prev => prev.slice(0, -1));
    }
  };

  const animatedDotStyle = index => {
    if (step === 1) {
      return useAnimatedStyle(() => ({
        transform: [
          {scale: newPasscode.length > index ? inputDotScale.value : 1},
          {translateX: shakeAnimation.value},
        ],
        backgroundColor:
          newPasscode.length > index
            ? wrongAttempt
              ? colors.dark.colors.red // Red color for wrong attempt
              : colors.dark.colors.blue // Default color for correct entry
            : colors.dark.colors.gray,
      }));
    } else {
      return useAnimatedStyle(() => ({
        transform: [
          {scale: confirmPasscode.length > index ? inputDotScale.value : 1},
          {translateX: shakeAnimation.value},
        ],
        backgroundColor:
          confirmPasscode.length > index
            ? wrongAttempt
              ? colors.dark.colors.red // Red color for wrong attempt
              : colors.dark.colors.blue // Default color for correct entry
            : colors.dark.colors.gray,
      }));
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top', 'bottom']}>
      <View style={styles.wrapper}>
        <View style={styles.passcodeMainContainer}>
          <Text style={styles.title}>{steps[step]?.title}</Text>
          <View style={styles.passcodeContainer}>
            {[...Array(6)].map((_, index) => (
              <DotIndicator
                key={index}
                isFilled={
                  (step === 1 ? newPasscode : confirmPasscode).length > index
                }
                animatedStyle={animatedDotStyle(index)}
              />
            ))}
          </View>
          <View style={styles.keypad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'erase'].map((digit, index) => (
              <KeypadButton
                key={index}
                digit={digit}
                onPress={() =>
                  digit === 'erase'
                    ? handleDelete()
                    : handleKeyPress(digit.toString())
                }
              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PasscodeScreen;

const createStyle = colors => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
    },
    wrapper: {
      flex: 1,
      padding: sizes.paddingHorizontal,
      alignItems: 'center',
    },
    passcodeMainContainer: {
      flex: 1,
      position: 'absolute',
      bottom: 0,
      alignItems: 'center',
    },
    title: {
      ...typography.fontStyles.nunitoBold,
      fontSize: fontPixel(20),
      color: colors.text,
    },
    faceId: {
      width: normalize(52.32),
      height: normalize(52.32),
    },
    passcodeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '60%',
      marginTop: normalize(70),
      marginBottom: normalize(85),
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    digit: {
      ...typography.fontStyles.nunitoBold,
      color: '#fff',
      fontSize: fontPixel(20),
    },
    keypad: Platform.select({
      ios: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: Device.getDeviceWidth() / 15,
        justifyContent: 'space-between',
      },
      android: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: Device.getDeviceWidth() / 10,
        justifyContent: 'space-between',
      },
    }),
    key: Platform.select({
      ios: {
        width: normalize(100),
        height: normalize(100),
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: normalize(10),
        backgroundColor: 'rgba(28, 28, 30, 1)',
        borderRadius: 100,
      },
      android: {
        width: normalize(90),
        height: normalize(90),
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: normalize(20),
        backgroundColor: 'rgba(28, 28, 30, 1)',
        borderRadius: 100,
      },
    }),
    keyText: {
      color: 'white',
      fontSize: 24,
    },
  });
};
