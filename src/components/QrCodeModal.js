import {useTheme} from '@react-navigation/native';
import {BlurView} from 'expo-blur';
import React, {useCallback, useImperativeHandle, useState} from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import Qrcode from './Qrcode';
import {normalize} from '../theme';

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
            <Qrcode value={value} size={normalize(250)} />
          </View>
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
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
