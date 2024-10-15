import {AntDesign, Ionicons, MaterialIcons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  Linking,
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
import {BottomSheet, Loader, QrCodeModal, Spacing} from '../../components';
import {accountType, networkList, networks} from '../../constants';
import {STORAGE} from '../../constants/storage';
import {
  addNewAccount,
  createWallet,
  setCurrentAccount,
  setCurrentNetwork,
  setWallets,
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
  const [balance, setBalance] = useState({balance: 0.0, currency: ''});
  const wallet = useSelector(state => state?.wallet);
  const dispatch = useDispatch();
  const accountBottomSheetRef = useRef(null);
  const networkBottomSheetRef = useRef(null);
  const qrCodeModalRef = useRef(null);

  useEffect(() => {
    if (wallet?.ethAccounts?.length === 0) {
      createWallets();
    }

    getBalance(
      wallet?.currentAccount?.address,
      networks[wallet?.currentAccount?.accountType]?.rpcUrl,
      wallet?.currentAccount?.accountType,
    )
      .then(res => {
        setBalance({
          balance: res,
          currency: wallet?.currentNetwork?.currencySymbol,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }, [focused, wallet]);

  const createWallets = async () => {
    if (focused) {
      setLoading(true);
      try {
        // Create mnemonic and store it
        const wallet = await createWalletMnemonic();
        await AsyncStorage.setItem(STORAGE.MNEMONIC, wallet?.mnemonic);

        // Parallel wallet creation for different account types
        const [evmWallet, trxWallet, solWallet, btcWallet] = await Promise.all([
          createEVMWallet(wallet?.mnemonic, 0),
          createTrxWallet(wallet?.mnemonic, 0),
          createSolWallet(wallet?.mnemonic, 0),
          createBtcWallet(wallet?.mnemonic, 0),
        ]);

        // Dispatch wallet creation
        dispatch(
          createWallet({
            ethAccount: createAccount(
              evmWallet,
              'Account - 1',
              accountType.ETH,
            ),
            solAccount: createAccount(
              solWallet,
              'Account - 1',
              accountType.SOLANA,
            ),
            btcAccount: createAccount(
              btcWallet,
              'Account - 1',
              accountType.BTC,
            ),
            tronAccount: createAccount(
              trxWallet,
              'Account - 1',
              accountType.TRON,
            ),
          }),
        );
      } catch (error) {
        console.error('Error creating wallets:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const createAccount = (wallet, accountName, accountType) => ({
    ...(wallet || {}),
    accountName,
    accountType,
    default: true,
  });

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
    const {accountType: selectedAccountType} = item;

    if (
      selectedAccountType === accountType.ETH &&
      wallet?.currentAccount?.accountType !== accountType.ETH
    ) {
      dispatch(setWallets(selectedAccountType));
    }

    if (
      selectedAccountType === accountType.ETH ||
      selectedAccountType === accountType.SOLANA ||
      selectedAccountType === accountType.BTC ||
      selectedAccountType === accountType.TRON
    ) {
      dispatch(setWallets(selectedAccountType));
      dispatch(setCurrentNetwork(item));
    }

    // Hide the bottom sheet
    networkBottomSheetRef?.current?.hide(0);
  };

  const onPressAddress = async () => {
    await Clipboard.setStringAsync(wallet?.currentAccount?.address);
  };

  const onPressAddNewAccount = async () => {
    const mnemonic = await AsyncStorage.getItem(STORAGE.MNEMONIC);
    const currentAccountType = wallet?.currentAccount?.accountType;
    let account = {};
    let length;
    let createWallet;

    switch (currentAccountType) {
      case accountType.ETH:
        length = wallet?.ethAccounts?.length + 1;
        createWallet = createEVMWallet;
        break;
      case accountType.SOLANA:
        length = wallet?.solAccounts?.length + 1;
        createWallet = createSolWallet;
        break;
      case accountType.BTC:
        length = wallet?.btcAccounts?.length + 1;
        createWallet = createBtcWallet;
        break;
      case accountType.TRON:
        length = wallet?.tronAccounts?.length + 1;
        createWallet = createTrxWallet;
        break;
      default:
        console.error('Unsupported account type');
        return;
    }

    try {
      const res = await createWallet(mnemonic, length);
      account = {
        ...res,
        accountName: `Account - ${length}`,
        accountType: currentAccountType,
      };
      dispatch(addNewAccount(account));
    } catch (error) {
      console.error(`create${currentAccountType}Wallet`, error);
    }
  };

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
                  style={styles.accountPic}
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
            <Spacing size={25} />
            <Text style={styles.balance}>
              {balance?.balance} {balance?.currency}
            </Text>
            <Spacing size={18} />
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: normalize(20),
              }}>
              <ActionButton>
                <MaterialIcons
                  name="call-made"
                  size={24}
                  color={tColors.dark.colors.appIcon}
                />
              </ActionButton>
              <ActionButton>
                <MaterialIcons
                  name="call-received"
                  size={24}
                  color={tColors.dark.colors.appIcon}
                />
              </ActionButton>
              <ActionButton
                onPress={() => {
                  qrCodeModalRef?.current?.show(
                    wallet?.currentAccount?.address,
                  );
                }}>
                <Ionicons
                  name="qr-code-outline"
                  size={24}
                  color={tColors.dark.colors.appIcon}
                />
              </ActionButton>
              <ActionButton
                onPress={() => {
                  let exploreUrl = networks[
                    wallet.currentNetwork?.key
                  ]?.blockExplorerUrl(wallet?.currentAccount?.address);
                  Linking.openURL(exploreUrl);
                }}>
                <AntDesign
                  name="earth"
                  size={24}
                  color={tColors.dark.colors.appIcon}
                />
              </ActionButton>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {/* Profile BottomSheet */}
      <BottomSheet ref={accountBottomSheetRef} isBottomTab={true}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}>
          <AccountItem
            key={'Accounts'}
            data={wallet?.wallets || []}
            onPress={onPressAccount}
            currentAccount={wallet?.currentAccount}
          />
        </ScrollView>
        <Text onPress={onPressAddNewAccount} style={styles.addNewAccount}>
          Add new account
        </Text>
        <Spacing size={30} />
      </BottomSheet>
      {/** Network BottomSheet */}
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
      <Loader visible={loading} />
      <QrCodeModal ref={qrCodeModalRef} />
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
              {item?.accountName}
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

const ActionButton = ({children, disabled = false, onPress}) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        width: normalize(50),
        height: normalize(50),
        borderWidth: 2,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: tColors.dark.colors.appIcon,
      }}>
      {children}
    </Pressable>
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
    accountName: {
      ...typography.fontStyles.nunitoBold,
      fontSize: fontPixel(20),
      color: colors.text,
    },
    accountAddress: {
      ...typography.fontStyles.nunitoSemiBold,
      fontSize: fontPixel(15),
      color: tColors.dark.colors.gray,
    },
    addNewAccount: {
      ...typography.fontStyles.nunitoSemiBold,
      alignSelf: 'center',
      color: tColors.dark.colors.appIcon,
      fontSize: fontPixel(18),
    },
    balance: {
      ...typography.fontStyles.nunitoExtraBold,
      alignSelf: 'center',
      fontSize: fontPixel(30),
      color: colors.text,
    },
  });
