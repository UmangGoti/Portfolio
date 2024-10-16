import {useTheme} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {
  Animated,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Spacing} from '../../components';
import {colors, normalize, sizes, typography} from '../../theme';

const delay = (time = 500) => new Promise(resolve => setTimeout(resolve, time));

const generateRandomArray = () => {
  return [...Array(10)].map(() => (Math.random() * 100).toFixed(0));
};

const BubbleSortScreen = () => {
  const [sorting, setSorting] = useState(false);
  const [currentI, setCurrentI] = useState(0);
  const [currentJ, setCurrentJ] = useState(0);
  const [currentJPrime, setCurrentJPrime] = useState(0);
  const [array, setArray] = useState(generateRandomArray);
  const {colors: _colors} = useTheme();
  const styles = createStyle(_colors);

  const animatedValues = useRef(array.map(() => new Animated.Value(1))).current; // Scale animation
  const colorValues = useRef(array.map(() => new Animated.Value(0))).current; // Color transition

  const callBubbleSort = useCallback(async () => {
    setSorting(true);
    const tempArray = [...array];
    const arrayLength = tempArray.length;

    for (let i = 0; i < arrayLength - 1; i++) {
      for (let j = 0; j < arrayLength - i - 1; j++) {
        setCurrentI(i);
        setCurrentJ(j);
        setCurrentJPrime(j + 1);

        // Animate color for comparison
        Animated.timing(colorValues[j], {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
        Animated.timing(colorValues[j + 1], {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();

        if (tempArray[j] > tempArray[j + 1]) {
          let temp = tempArray[j];
          tempArray[j] = tempArray[j + 1];
          tempArray[j + 1] = temp;

          // Swap scale animation
          Animated.sequence([
            Animated.timing(animatedValues[j], {
              toValue: 1.2,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(animatedValues[j], {
              toValue: 1,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start();

          Animated.sequence([
            Animated.timing(animatedValues[j + 1], {
              toValue: 1.2,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(animatedValues[j + 1], {
              toValue: 1,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start();
        }

        LayoutAnimation.easeInEaseOut();
        setArray([...tempArray]);
        await delay(500);

        // Reset color after comparison
        Animated.timing(colorValues[j], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
        Animated.timing(colorValues[j + 1], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    }
    setSorting(false);
  }, [array, animatedValues, colorValues]);

  const animatedBackgroundColor = index => {
    return colorValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [colors.dark.colors.blue, colors.dark.colors.purple],
    });
  };

  const regenerateArray = () => {
    if (!sorting) {
      const newArray = generateRandomArray();
      LayoutAnimation.easeInEaseOut();
      setArray(newArray);

      // Reset animations and values
      newArray.forEach((_, i) => {
        animatedValues[i].setValue(1);
        colorValues[i].setValue(0);
      });

      setCurrentI(0);
      setCurrentJ(0);
      setCurrentJPrime(0);
    }
  };

  return (
    <View style={styles.container}>
      {array.map((item, index) => {
        return (
          <Animated.View
            key={index}
            style={{
              marginHorizontal: normalize(2),
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
              backgroundColor: animatedBackgroundColor(index),
              borderRadius: 8,
              transform: [{scale: animatedValues[index]}],
              width: normalize(item) * 2,
              minWidth: 50,
              marginVertical: normalize(2.5),
            }}>
            <Text style={styles.arrayItem}>{item}</Text>
          </Animated.View>
        );
      })}
      <Spacing size={30} />
      <View style={styles.indexContainer}>
        <Text style={styles.indexValue}>i = {currentI}</Text>
        <Spacing direction="x" size={20} />
        <Text style={styles.indexValue}>j = {currentJ}</Text>
        <Spacing direction="x" size={20} />
        <Text style={styles.indexValue}>j + 1 = {currentJPrime}</Text>
      </View>
      <Spacing size={30} />
      <TouchableOpacity
        style={styles.button}
        onPress={callBubbleSort}
        disabled={sorting}>
        <Text style={styles.title}>Sort Array</Text>
      </TouchableOpacity>
      <Spacing size={20} />
      <TouchableOpacity
        style={styles.button}
        onPress={regenerateArray}
        disabled={sorting}>
        <Text style={styles.title}>Regenerate Array</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BubbleSortScreen;

const createStyle = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
      paddingHorizontal: sizes.paddingHorizontal,
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrayItem: {
      ...typography.fontStyles.nunitoBold,
      color: '#fff',
    },
    indexValue: {
      ...typography.fontStyles.nunitoSemiBold,
      color: colors.text,
    },
    indexContainer: {flexDirection: 'row'},
    button: {
      height: normalize(45),
      backgroundColor: colors.backgroundColor,
      minWidth: '55%',
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    title: {
      ...typography.fontStyles.nunitoBold,
      color: colors.text,
    },
  });
