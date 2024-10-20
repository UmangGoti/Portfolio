import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {strings} from '../../../i18';
import {fontPixel, normalize, typography} from '../../theme/index';

const MyProfile = () => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyle(colors);
  return (
    <View>
      <Text>{strings('Profile.name')}</Text>
    </View>
  );
};

export default MyProfile;

const createStyle = colors =>
  StyleSheet.create({
    profilePicContainer: {
      width: normalize(180),
      height: normalize(180),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderRadius: 9999,
      overflow: 'hidden',
    },
    profilePic: {
      width: normalize(165),
      height: normalize(165),
      borderRadius: 9999,
    },
    name: {
      ...typography.fontStyles.nunitoExtraBold,
      fontSize: fontPixel(38),
      letterSpacing: 5,
    },
    role: {
      ...typography.fontStyles.nunitoRegular,
      fontSize: fontPixel(17),
      color: colors.gray,
    },
  });
