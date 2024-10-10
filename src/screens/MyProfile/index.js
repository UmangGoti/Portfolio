import { useTheme } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fontPixel, normalize, typography } from "../../theme/index";
import Device from "../../utils/device";
import QuickCrypto from "react-native-quick-crypto";
import { ethers } from "ethers";
import {
  createEVMWallet,
  createSolWallet,
  createTrxWallet,
  createWalletMnemonic,
} from "../../web3-wallet";

const MyProfile = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyle(colors);
  useEffect(() => {
    createWalletMnemonic()
      .then((res) => {
        console.log(res);
        createEVMWallet(res?.mnemonic, 0)
          .then((wallet) => {
            console.log("Eth - ", wallet);
          })
          .catch((e) => {
            console.error(e);
          });
        createTrxWallet(res?.mnemonic, 0)
          .then((wallet) => {
            console.log("Tron - ", wallet);
          })
          .catch((e) => {
            console.error(e);
          });
        createSolWallet(res?.mnemonic, 0)
          .then((wallet) => {
            console.log("Solana - ", wallet);
          })
          .catch((e) => {
            console.error(e);
          });
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);
  return <View></View>;
};

export default MyProfile;

const createStyle = (colors) =>
  StyleSheet.create({
    profilePicContainer: {
      width: normalize(180),
      height: normalize(180),
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderRadius: 9999,
      overflow: "hidden",
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
