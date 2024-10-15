import {Ionicons} from '@expo/vector-icons';
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
import {accountType, networkList, networks} from '../../constants';
import {
  createWallet,
  setCurrentAccount,
  setCurrentNetwork,
} from '../../redux/slice/walletSlice';
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
  getBalance,
} from '../../web3/web3-wallet';

const Wallet = () => {
  const {colors} = useTheme();
  const styles = createStyle(colors);
  const focused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0.0);
  const wallet = useSelector(state => state?.wallet);
  const dispatch = useDispatch();
  const accountBottomSheetRef = useRef(null);
  const networkBottomSheetRef = useRef(null);

  useEffect(() => {
    if (wallet?.ethAccounts?.length === 0) {
      createWallets();
    }

    if (
      wallet?.currentAccount?.address &&
      wallet?.currentAccount?.accountType === accountType.ETH
    ) {
      getBalance(wallet?.currentAccount?.address, networks.ETH.rpcUrl)
        .then(res => {
          setBalance(res);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [focused, wallet]);

  const createWallets = async () => {
    if (focused) {
      setLoading(true);
      const wallet = await createWalletMnemonic();
      const evmWallet = await createEVMWallet(wallet?.mnemonic, 0);
      const trxWallet = await createTrxWallet(wallet?.mnemonic, 0);
      const solWallet = await createSolWallet(wallet?.mnemonic, 0);
      const btcWallet = await createBtcWallet(wallet?.mnemonic, 0);
      dispatch(
        createWallet({
          ethAccount: {
            ...(evmWallet || {}),
            accountName: 'Account - 1',
            accountType: accountType.ETH,
            default: true,
          },
          solAccount: {
            ...(trxWallet || {}),
            accountName: 'Account - 1',
            accountType: accountType.SOLANA,
            default: true,
          },
          btcAccount: {
            ...(solWallet || {}),
            accountName: 'Account - 1',
            accountType: accountType.BTC,
            default: true,
          },
          tronAccount: {
            ...(btcWallet || {}),
            accountName: 'Account - 1',
            accountType: accountType.TRON,
            default: true,
          },
        }),
      );
      setLoading(false);
    }
  };

  const onPressProfile = useCallback(() => {
    const isActive = accountBottomSheetRef?.current?.isActive();
    if (isActive) {
      accountBottomSheetRef?.current?.hide();
    } else {
      accountBottomSheetRef?.current?.show();
    }
  });

  const onPressNetworkIcon = useCallback(() => {
    const isActive = networkBottomSheetRef?.current?.isActive();
    if (isActive) {
      networkBottomSheetRef?.current?.hide();
    } else {
      networkBottomSheetRef?.current?.show();
    }
  });

  const onPressAccount = item => {
    dispatch(setCurrentAccount(item));
  };

  const onPressNetwork = item => {
    dispatch(setCurrentNetwork(item));
    networkBottomSheetRef?.current?.scrollTo(0);
  };

  const onPressAddress = () => {};

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.wrapper}>
          <Header
            networkImage={wallet?.currentNetwork?.networkImage}
            onPressNetworkIcon={onPressNetworkIcon}
          />
          <ScrollView
            contentContainerStyle={{alignItems: 'flex-start'}}
            style={{
              paddingHorizontal: sizes.paddingHorizontal,
              paddingVertical: sizes.paddingVertical,
            }}>
            <View style={styles.accountInfoContainer}>
              <Pressable
                style={styles.accountPicContainer}
                onPress={onPressProfile}>
                <Image
                  source={
                    wallet?.currentAccount?.address
                      ? {uri: toDataUrl(wallet?.currentAccount?.address)}
                      : icon
                  }
                  style={{
                    width: normalize(50),
                    height: normalize(50),
                    borderRadius: 100,
                  }}
                />
              </Pressable>
              <Spacing direction="x" size={20} />
              <View style={{flex: 1}}>
                <Text style={styles.accountName}>
                  {wallet?.currentAccount?.accountName}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  style={styles.accountAddress}
                  onPress={onPressAddress}>
                  {wallet?.currentAccount?.address}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {/* Profile Bottom Sheet */}
      <BottomSheet ref={accountBottomSheetRef} isBottomTab={true}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}>
          <AccountItem
            key={'Eth Accounts'}
            data={wallet?.wallets || []}
            onPress={onPressAccount}
            currentAccount={wallet?.currentAccount}
          />
        </ScrollView>
        <Text
          style={{
            ...typography.fontStyles.nunitoSemiBold,
            alignSelf: 'center',
            color: tColors.dark.colors.appIcon,
            fontSize: fontPixel(18),
          }}>
          Add new account
        </Text>
        <Spacing size={30} />
      </BottomSheet>
      <BottomSheet ref={networkBottomSheetRef} isBottomTab={true}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <NetworkItem
            key={wallet?.currentNetwork?.networkImage}
            data={networkList || []}
            onPress={onPressNetwork}
            currentNetwork={wallet?.currentNetwork}
          />
        </ScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Wallet;

const Header = ({
  networkImage = undefined,
  onPressNetworkIcon = () => {},
  onPressSetting = () => {},
}) => {
  const {colors} = useTheme();
  const styles = createStyle(colors);
  return (
    <View style={styles.headerContainer}>
      <Icon onPress={onPressNetworkIcon}>
        <View style={styles.profilePicContainer}>
          <Image
            source={networkImage}
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

const AccountItem = ({data, title, onPress, currentAccount = {}}) => {
  const {colors} = useTheme();
  const styles = createStyle(colors);
  return (
    <View style={styles.profileContainer} key={title}>
      {title ? <Text style={styles.profileContainerTitle}>{title}</Text> : null}
      {title ? <Spacing size={10} /> : null}
      {data.map((item, index) => (
        <Pressable
          key={`${title}-${index}`}
          style={[
            currentAccount?.address?.toLowerCase() ===
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

const NetworkItem = ({data, title, onPress, currentNetwork = {}}) => {
  const {colors} = useTheme();
  const styles = createStyle(colors);
  return (
    <View style={styles.profileContainer} key={title}>
      {data.map((item, index) => (
        <Pressable
          key={`${title}-${index}`}
          style={[
            currentNetwork?.networkName === item?.networkName
              ? styles.currentNetwork
              : styles.network,
          ]}
          onPress={() => onPress(item, index)}>
          <View style={styles.networkIconContainer}>
            <Image source={item?.networkImage} style={styles.networkIcon} />
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
              {item?.networkName}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={{
                ...typography.fontStyles.nunitoSemiBold,
                color: tColors.dark.colors.gray,
                fontSize: fontPixel(16),
              }}>
              {item?.currencySymbol}
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
    },
    headerContainer: {
      // position: 'absolute',
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
      borderWidth: 2,
      borderColor: 'transparent',
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
    networkIconContainer: {
      borderRadius: 100,
      borderWidth: normalize(2),
      padding: normalize(2),
      borderColor: colors.bottomSheet.accountPicBorderColor,
    },
    networkIcon: {
      width: normalize(42),
      height: normalize(42),
      borderRadius: 100,
    },
    network: {
      flexDirection: 'row',
      paddingHorizontal: sizes.paddingHorizontal,
      marginVertical: normalize(5),
      paddingVertical: normalize(12),
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    currentNetwork: {
      flexDirection: 'row',
      paddingHorizontal: sizes.paddingHorizontal,
      marginVertical: normalize(5),
      paddingVertical: normalize(12),
      alignItems: 'center',
      borderColor: colors.bottomSheet.selectedItemBorderColor,
      borderWidth: 2,
      borderRadius: 12,
    },
    accountInfoContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    accountName: {...typography.fontStyles.nunitoBold, fontSize: fontPixel(20)},
    accountAddress: {
      ...typography.fontStyles.nunitoSemiBold,
      fontSize: fontPixel(15),
    },
  });
