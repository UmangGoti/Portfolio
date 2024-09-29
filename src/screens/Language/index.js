import Fontisto from "@expo/vector-icons/Fontisto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { setLocale } from "../../../i18";
import { Spacing } from "../../components";
import { STORAGE } from "../../constants/storage";
import {
  fontPixel,
  normalize,
  pixelSizeHorizontal,
  sizes,
  typography,
} from "../../theme";

const Language = () => {
  const { colors } = useTheme();
  const styles = createStyle(colors);
  const [local, setLocal] = useState(null);

  useEffect(() => {
    // Fetch language only once when component mounts
    const fetchLanguage = async () => {
      const res = await AsyncStorage.getItem(STORAGE.LANGUAGE);
      setLocal(res);
    };
    fetchLanguage();
  }, []);

  const handleLanguageSelection = async (type) => {
    setLocal(type); // Update the state to reflect the selected language
    await setLocale(type); // Set the locale (assuming this changes the app language)
  };

  const languageOptions = useMemo(
    () => [
      { title: "English", type: "en" },
      { title: "Hindi", type: "hi" },
      { title: "Gujarati", type: "gu" },
    ],
    []
  );

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => handleLanguageSelection(item.type)} // Manage click event here
          style={styles.itemContainer}
        >
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Fontisto
            name={
              item.type === local ? "radio-btn-active" : "radio-btn-passive"
            }
            size={18}
            color={colors.radioButton.radioColor}
          />
        </TouchableOpacity>
      );
    },
    [local]
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={styles.wrapper}>
        <Text style={styles.headerText}>Select Language</Text>
        <Spacing size={normalize(20)} />
        <FlatList
          data={languageOptions}
          contentContainerStyle={styles.contentContainerStyle}
          keyExtractor={(item) => item.type}
          extraData={local}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

export default Language;

const createStyle = (colors) => {
  return StyleSheet.create({
    wrapper: {
      flex: 1,
      paddingVertical: sizes.paddingVertical,
      paddingHorizontal: sizes.paddingHorizontal,
    },
    headerText: {
      fontSize: fontPixel(35),
      fontFamily: typography.fonts.nunitoBold,
      color: colors.header.color,
    },
    contentContainerStyle: {
      gap: 15,
    },
    itemContainer: {
      flexDirection: "row",
      paddingHorizontal: pixelSizeHorizontal(20),
      height: normalize(60),
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: normalize(12),
      borderWidth: 2,
      borderColor: colors.radioButton.borderColor,
    },
    itemTitle: {
      color: colors.radioButton.textColor,
      fontSize: fontPixel(15),
      ...typography.fontStyles.nunitoBold,
    },
  });
};
