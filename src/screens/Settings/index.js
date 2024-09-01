import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { ic_chevron_right } from "../../assets/images";
import { Spacing, ToggleButton } from "../../components";
import { STORAGE } from "../../constants/storage";
import { setMode } from "../../redux/slice/globalSlice";
import { heightPixel, normalize, pixelSizeHorizontal, sizes, typography } from "../../theme";

const Settings = () => {
  const global = useSelector(state => state?.global)
  const dispatch = useDispatch()
  const { colors } = useTheme();
  const styles = createStyle(colors);

  const renderItem = ({ item, index }) => {
    return (<View style={styles.itemContainer}>
      <Text style={styles.title}>{item?.title}</Text>
      {item?.componentType === 'Toggle' ?
        <ToggleButton isToggleOn={item?.value} onPressToggle={item?.onPress} />
        :
        <Image source={ic_chevron_right} style={styles.chevronRight} resizeMode="contain" />}
    </View>);
  }

  const keyExtractor = (_, index) => `${index}`

  const ItemSeparatorComponent = () => <Spacing size={10} />;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={styles.wrapper}>
        <FlashList
          data={[{
            title: "Light/Dark", componentType: 'Toggle', value: global?.isDarkTheme, onPress: async () => {
              console.log('called');

              dispatch(setMode(!global?.isDarkTheme))
              await AsyncStorage.setItem(STORAGE.MODE, global?.isDarkTheme ? 'light' : 'dark')
            }
          }, { title: "Language" }]}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainerStyle}
          ItemSeparatorComponent={ItemSeparatorComponent}
          estimatedItemSize={normalize(75)}
        />
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const createStyle = (colors) => {
  return StyleSheet.create({
    wrapper: { flex: 1 },
    itemContainer: {
      marginHorizontal: sizes.marginHorizontal,
      paddingHorizontal: pixelSizeHorizontal(20),
      paddingVertical: pixelSizeHorizontal(20),
      borderRadius: normalize(12),
      elevation: 5, // For Android shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 }, // For iOS shadow
      shadowOpacity: 0.2,
      shadowRadius: 2,
      backgroundColor: colors.white,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: normalize(70)
    },
    contentContainerStyle: { paddingBottom: heightPixel(100), paddingVertical: sizes.paddingVertical },
    title: {
      ...typography.fontStyles.nunitoBold,
    },
    chevronRight: {
      width: normalize(20),
      height: normalize(20)
    }
  });
};
