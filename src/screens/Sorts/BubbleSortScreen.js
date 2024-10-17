import {useTheme} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
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
  const [array, setArray] = useState(generateRandomArray);
  const {colors: _colors} = useTheme();
  const styles = createStyle(_colors);

  const callBubbleSort = useCallback(async () => {
    setSorting(true);
    const tempArray = [...array];
    const arrayLength = tempArray.length;

    for (let i = 0; i < arrayLength; i++) {
      for (let j = i + 1; j < arrayLength; j++) {
        setCurrentI(i);
        setCurrentJ(j);

        if (tempArray[i] > tempArray[j]) {
          let temp = tempArray[j];
          tempArray[j] = tempArray[i];
          tempArray[i] = temp;
          LayoutAnimation.easeInEaseOut();
          setArray([...tempArray]);
          await delay(500);
        }
      }
    }
    setSorting(false);
  }, [array]);

  const regenerateArray = () => {
    if (!sorting) {
      const newArray = generateRandomArray();
      LayoutAnimation.easeInEaseOut();
      setArray(newArray);

      setCurrentI(0);
      setCurrentJ(0);
    }
  };

  return (
    <View style={styles.container}>
      {array.map((item, index) => {
        return (
          <View
            key={index}
            style={{
              marginHorizontal: normalize(2),
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
              backgroundColor: colors.dark.colors.blue,
              borderRadius: 8,
              width: normalize(item) * 2,
              minWidth: 50,
              marginVertical: normalize(2.5),
            }}>
            <Text style={styles.arrayItem}>{item}</Text>
          </View>
        );
      })}
      <Spacing size={30} />
      <View style={styles.indexContainer}>
        <Text style={styles.indexValue}>i = {currentI}</Text>
        <Spacing direction="x" size={20} />
        <Text style={styles.indexValue}>j = {currentJ}</Text>
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
