import {MaterialIcons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ic_chevron_right} from '../../assets/images';
import {ParallaxScrollView, ToggleButton} from '../../components';
import {ROUTES} from '../../constants';
import {STORAGE} from '../../constants/storage';
import {navigate} from '../../navigation/NavigationUtils';
import {setMode} from '../../redux/slice/globalSlice';
import {
  fontPixel,
  normalize,
  pixelSizeHorizontal,
  sizes,
  typography,
} from '../../theme';

const Settings = () => {
  const global = useSelector(state => state?.global);
  const dispatch = useDispatch();
  const {colors} = useTheme();
  const styles = createStyle(colors);

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.9}
        style={styles.itemContainer}
        disabled={item?.disabled}
        onPress={item?.onPress}>
        <Text style={styles.title}>{item?.title}</Text>
        {item?.componentType === 'Toggle' ? (
          <ToggleButton
            isToggleOn={item?.value}
            onPressToggle={item?.onPress}
          />
        ) : (
          <Image
            source={ic_chevron_right}
            style={styles.chevronRight}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={global?.isDarkTheme ? '#1D3D47' : '#A1CEDC'}
      headerImage={
        <MaterialIcons size={310} name="settings" style={styles.headerImage} />
      }>
      <View style={styles.wrapper}>
        <Text style={styles.headerText}>Settings</Text>
        {[
          {
            title: 'Light/Dark',
            componentType: 'Toggle',
            value: global?.isDarkTheme,
            disabled: true,
            onPress: async () => {
              dispatch(setMode(!global?.isDarkTheme));
              await AsyncStorage.setItem(
                STORAGE.MODE,
                global?.isDarkTheme ? 'light' : 'dark',
              );
            },
          },
          {
            title: 'Language',
            onPress: () => {
              navigate(ROUTES.SCREENS.LANGUAGE_SCREEN);
            },
          },
        ].map(renderItem)}
      </View>
    </ParallaxScrollView>
  );
};

export default Settings;

const createStyle = colors => {
  return StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background,
      gap: 10,
      paddingHorizontal: sizes.paddingHorizontal,
      paddingVertical: sizes.paddingVertical,
    },
    itemContainer: {
      paddingHorizontal: pixelSizeHorizontal(20),
      paddingVertical: pixelSizeHorizontal(20),
      maxHeight: normalize(60),
      borderRadius: normalize(12),
      elevation: 5, // For Android shadow
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2}, // For iOS shadow
      shadowOpacity: 0.2,
      shadowRadius: 2,
      backgroundColor: colors.white,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      ...typography.fontStyles.nunitoBold,
    },
    chevronRight: {
      width: normalize(20),
      height: normalize(20),
    },
    headerText: {
      fontSize: fontPixel(35),
      ...typography.fontStyles.nunitoBold,
      color: colors?.header?.color,
    },
    headerImage: {
      color: '#fff',
      bottom: -90,
      left: -35,
      position: 'absolute',
    },
  });
};
