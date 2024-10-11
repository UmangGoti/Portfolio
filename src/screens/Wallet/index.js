import { useIsFocused, useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  createEVMWallet,
  createSolWallet,
  createWalletMnemonic,
} from "../../web3/web3-wallet";
import { fontPixel, normalize, sizes, typography } from "../../theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import Device from "../../utils/device";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { toDataUrl } from "../../web3/Blockies";
import { icon } from "../../assets/images";

const Wallet = () => {
  const { colors } = useTheme();
  const styles = createStyle(colors);
  const focused = useIsFocused();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    createWallets();
  }, [focused]);

  const createWallets = async () => {
    if (focused) {
      setLoading(true);
      const wallet = await createWalletMnemonic();
      const account = await createEVMWallet(wallet?.mnemonic, 0);
      setWallets([account]);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.wrapper}>
        <Header
          walletProfilePic={loading ? undefined : wallets?.[0]?.address}
        />
        <ScrollView></ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Wallet;

const Header = ({
  walletProfilePic = undefined,
  onPressProfilePic = () => {},
  onPressSetting = () => {},
}) => {
  const { colors } = useTheme();
  const styles = createStyle(colors);
  return (
    <View style={styles.headerContainer}>
      <Icon onPress={onPressProfilePic}>
        <View style={styles.profilePicContainer}>
          <Image
            source={
              walletProfilePic ? { uri: toDataUrl(walletProfilePic) } : icon
            }
            style={styles.profilePic}
            resizeMode="contain"
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

const Icon = ({ children, onPress = () => {} }) => {
  const { colors } = useTheme();
  const styles = createStyle(colors);
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      touchSoundDisabled={false}
      style={styles.headerIcon}
    >
      {children}
    </TouchableOpacity>
  );
};

const createStyle = (colors) =>
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
      position: "absolute",
      width: Device.getDeviceWidth(),
      height: normalize(60),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 2,
      borderBottomColor: colors.border,
      paddingHorizontal: sizes.paddingHorizontal,
      zIndex: 2,
    },
    headerTitle: {
      ...typography.fontStyles.nunitoBold,
      color: colors.text,
      fontSize: fontPixel(25),
      textAlign: "center",
    },
    headerIcon: {
      width: normalize(40),
      height: normalize(40),
      justifyContent: "center",
      alignItems: "center",
    },
    profilePicContainer: {
      alignItems: "center",
      justifyContent: "center",
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
  });
