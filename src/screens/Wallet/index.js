import {Ionicons} from '@expo/vector-icons';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useIsFocused, useTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {icon} from '../../assets/images';
import {Spacing} from '../../components';
import BottomSheet from '../../components/BottomSheet';
import {createWallet} from '../../redux/slice/walletSlice';
import {
  fontPixel,
  normalize,
  sizes,
  colors as tColors,
  typography,
} from '../../theme';
import Device from '../../utils/device';
import {toDataUrl} from '../../web3/Blockies';
import {
  createBtcWallet,
  createEVMWallet,
  createSolWallet,
  createTrxWallet,
  createWalletMnemonic,
} from '../../web3/web3-wallet';

const Wallet = () => {
  const {colors} = useTheme();
  const styles = createStyle(colors);
  const focused = useIsFocused();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const wallet = useSelector(state => state?.wallet);
  const dispatch = useDispatch();
  const bottomSheetRefProps = useRef(null);
  const bottomTabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    if (wallet?.ethAccounts?.length === 0) {
      createWallets();
    } else {
      setWallets(wallet?.ethAccounts);
    }
  }, [focused]);

  const createWallets = async () => {
    if (focused) {
      setLoading(true);
      const wallet = await createWalletMnemonic();
      const evmWallet = await createEVMWallet(wallet?.mnemonic, 0);
      const trxWallet = await createTrxWallet(wallet?.mnemonic, 0);
      const solWallet = await createSolWallet(wallet?.mnemonic, 0);
      const btcWallet = await createBtcWallet(wallet?.mnemonic, 0);
      setWallets([evmWallet]);
      dispatch(
        createWallet({
          ethAccount: {...(evmWallet || {}), default: true},
          solAccount: {...(trxWallet || {}), default: true},
          btcAccount: {...(solWallet || {}), default: true},
          tronAccount: {...(btcWallet || {}), default: true},
        }),
      );
      setLoading(false);
    }
  };

  const onPress = useCallback(() => {
    const isActive = bottomSheetRefProps?.current?.isActive();
    if (isActive) {
      bottomSheetRefProps?.current?.scrollTo(0);
    } else {
      bottomSheetRefProps?.current?.scrollTo(-500);
    }
  }, []);

  const onPressEthAccount = (item, index) => {
    console.log(index, ' - ', item);
  };
  const onPressSolanaAccount = (item, index) => {
    console.log(index, ' - ', item);
  };
  const onPressBtcAccount = (item, index) => {
    console.log(index, ' - ', item);
  };
  const onPressTronAccount = (item, index) => {
    console.log(index, ' - ', item);
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.wrapper}>
          <Header
            walletProfilePic={loading ? undefined : wallets?.[0]?.address}
            onPressProfilePic={() => {
              onPress();
            }}
          />
        </View>
      </SafeAreaView>
      <BottomSheet ref={bottomSheetRefProps} isBottomTab={true}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: bottomTabBarHeight + normalize(50),
          }}
          showsVerticalScrollIndicator={false}>
          <Profiles
            key={'Eth Accounts'}
            title={'Eth Accounts'}
            data={wallet?.ethAccounts || []}
            onPress={onPressEthAccount}
            selectedWallet={wallet?.selectedWallet}
          />
          <Profiles
            key={'Solana Accounts'}
            title={'Solana Accounts'}
            data={wallet?.solAccounts || []}
            onPress={onPressSolanaAccount}
          />
          <Profiles
            key={'Btc Accounts'}
            title={'Btc Accounts'}
            data={wallet?.btcAccounts || []}
            onPress={onPressBtcAccount}
          />
          <Profiles
            key={'Tron Accounts'}
            title={'Tron Accounts'}
            data={wallet?.tronAccounts || []}
            onPress={onPressTronAccount}
          />
        </ScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Wallet;

const Header = ({
  walletProfilePic = undefined,
  onPressProfilePic = () => {},
  onPressSetting = () => {},
}) => {
  const {colors} = useTheme();
  const styles = createStyle(colors);
  return (
    <View style={styles.headerContainer}>
      <Icon onPress={onPressProfilePic}>
        <View style={styles.profilePicContainer}>
          <Image
            source={
              walletProfilePic ? {uri: toDataUrl(walletProfilePic)} : icon
            }
            style={styles.profilePic}
            contentFit="contain"
          />
        </View>
      </Icon>
      <Text style={styles.headerTitle}>Wallet</Text>
      <Icon onPress={onPressSetting}>
        <Ionicons name="settings" size={24} color={colors.icon} />
      </Icon>
    </View>
  );
};

const Icon = ({children, onPress = () => {}}) => {
  const {colors} = useTheme();
  const styles = createStyle(colors);
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      touchSoundDisabled={false}
      style={styles.headerIcon}>
      {children}
    </TouchableOpacity>
  );
};

const Profiles = ({data, title, onPress, selectedWallet = {}}) => {
  const {colors} = useTheme();
  const styles = createStyle(colors);
  return (
    <View style={styles.profileContainer} key={title}>
      <Text style={styles.profileContainerTitle}>{title}</Text>
      <Spacing size={10} />
      {data.map((item, index) => (
        <Pressable
          key={`${title}-${index}`}
          style={[
            selectedWallet?.address?.toLowerCase() ===
            item?.address?.toLowerCase()
              ? styles.currentAccount
              : styles.account,
          ]}
          onPress={() => onPress(item, index)}>
          <View style={styles.accountPicContainer}>
            <Image
              source={{uri: item?.address ? toDataUrl(item?.address) : icon}}
              style={styles.accountPic}
            />
          </View>
          <Spacing direction="X" size={normalize(20)} />
          <View style={{flex: 1}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={{
                ...typography.fontStyles.nunitoSemiBold,
                color: colors.text,
                fontSize: fontPixel(20),
              }}>
              {`Account - ${index}`}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={{
                ...typography.fontStyles.nunitoSemiBold,
                color: tColors.dark.colors.gray,
                fontSize: fontPixel(16),
              }}>
              {item?.address}
            </Text>
          </View>
          <Spacing direction="X" size={normalize(20)} />
        </Pressable>
      ))}
    </View>
  );
};

const createStyle = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
    },
    wrapper: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: sizes.paddingHorizontal,
    },
    headerContainer: {
      position: 'absolute',
      width: Device.getDeviceWidth(),
      height: normalize(60),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 2,
      borderBottomColor: colors.border,
      paddingHorizontal: sizes.paddingHorizontal,
      zIndex: 2,
    },
    headerTitle: {
      ...typography.fontStyles.nunitoBold,
      color: colors.text,
      fontSize: fontPixel(25),
      textAlign: 'center',
    },
    headerIcon: {
      width: normalize(40),
      height: normalize(40),
      justifyContent: 'center',
      alignItems: 'center',
    },
    profilePicContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      borderWidth: 2,
      borderColor: colors.border,
      padding: 2,
    },
    profilePic: {
      width: normalize(28),
      height: normalize(28),
      borderRadius: 100,
    },
    profileContainer: {
      paddingHorizontal: sizes.paddingHorizontal,
      paddingVertical: sizes.paddingVertical,
    },
    profileContainerTitle: {
      ...typography.fontStyles.nunitoBold,
      color: colors.text,
      fontSize: fontPixel(18),
    },
    account: {
      flexDirection: 'row',
      paddingHorizontal: sizes.paddingHorizontal,
      marginVertical: normalize(5),
      paddingVertical: normalize(12),
      alignItems: 'center',
    },
    currentAccount: {
      flexDirection: 'row',
      paddingHorizontal: sizes.paddingHorizontal,
      marginVertical: normalize(5),
      paddingVertical: normalize(12),
      alignItems: 'center',
      borderColor: colors.bottomSheet.selectedItemBorderColor,
      borderWidth: 2,
      borderRadius: 12,
    },
    accountPicContainer: {
      borderRadius: 100,
      borderWidth: normalize(2),
      padding: normalize(2),
      borderColor: colors.bottomSheet.accountPicBorderColor,
    },
    accountPic: {
      width: normalize(42),
      height: normalize(42),
      borderRadius: 100,
    },
  });
