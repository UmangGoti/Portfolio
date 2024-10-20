import {useTheme} from '@react-navigation/native';
import {BlurView} from 'expo-blur';
import React, {useCallback, useImperativeHandle, useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {fontPixel, normalize, sizes, typography} from '../theme';
import {copyToClipboard} from '../utils/helper';
import Qrcode from './Qrcode';
import Spacing from './Spacing';

const QrCodeModal = React.forwardRef(({}, ref) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const {colors} = useTheme();
  const styles = createStyle(colors);

  const show = useCallback(data => {
    setVisible(true);
    setValue(data);
  }, []);

  const hide = useCallback(async () => {
    setVisible(false);
  }, []);

  useImperativeHandle(ref, () => ({show, hide}), [show, hide]);

  if (!visible) return null;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        style={styles.modal}
        onRequestClose={hide}
        onDismiss={hide}>
        <BlurView blurType={'dark'} style={styles.blurContainer} />
        <Pressable style={styles.wrapper} onPress={hide}>
          <View style={styles.qrContainer}>
            <Qrcode
              key={'QrCode'}
              value={value}
              size={normalize(250)}
              fillColor="transparent"
              dotFillColor={colors.qrCode.dotFillColor}
              cornerRectFillColor={colors.qrCode.cornerRectFillColor}
              invertCornerRectFillColor={
                colors.qrCode.invertCornerRectFillColor
              }
            />
          </View>
          <Spacing size={20} />
          <Pressable
            style={styles.addressContainer}
            onPress={() => copyToClipboard(value)}>
            <Text
              style={styles.address}
              numberOfLines={1}
              ellipsizeMode="middle">
              {value}
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
});

export default React.memo(QrCodeModal);

const createStyle = colors =>
  StyleSheet.create({
    modal: {flex: 1},
    blurContainer: {...StyleSheet.absoluteFillObject, position: 'absolute'},
    wrapper: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    qrContainer: {
      padding: 20,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.qrCode.backgroundColor,
    },
    addressContainer: {
      paddingLeft: normalize(20),
      paddingTop: normalize(10),
      paddingRight: normalize(20),
      paddingBottom: normalize(10),
      marginHorizontal: sizes.marginHorizontal,
      backgroundColor: colors.qrCode.backgroundColor,
      borderRadius: 12,
    },
    address: {
      ...typography.fontStyles.nunitoBold,
      color: colors.qrCode.address,
      fontSize: fontPixel(15),
    },
  });
