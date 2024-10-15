import {useTheme} from '@react-navigation/native';
import {BlurView} from 'expo-blur';
import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import {normalize} from '../theme';

const Loader = ({visible = false}) => {
  const {colors} = useTheme();
  const styles = createStyle(colors);

  if (!visible) return null;

  return (
    <>
      <Modal visible={visible} transparent style={styles.modal}>
        <BlurView style={styles.blurContainer} />
        <View style={styles.wrapper}>
          <View style={styles.activityContainer}>
            <ActivityIndicator
              animating={visible}
              color={colors.loader.activityIndicator}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default React.memo(Loader);

const createStyle = colors =>
  StyleSheet.create({
    modal: {flex: 1},
    blurContainer: {...StyleSheet.absoluteFillObject, position: 'absolute'},
    wrapper: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    activityContainer: {
      width: normalize(75),
      height: normalize(75),
      borderRadius: 20,
      backgroundColor: colors.loader.activityContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
