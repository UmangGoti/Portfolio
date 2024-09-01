import { useTheme } from "@react-navigation/native";
import { AnimatedFlashList } from "@shopify/flash-list";
import React, { useCallback, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ic_chevron_right } from "../../assets/images";
import { Spacing } from "../../components";
import { ROUTES } from "../../constants";
import { navigate } from "../../navigation/NavigationUtils";
import { fontPixel, heightPixel, normalize, pixelSizeHorizontal, sizes, typography } from "../../theme";

const Explore = () => {
  const { colors } = useTheme();
  const styles = createStyle(colors);
  const scrollY = useRef(new Animated.Value(0)).current;

  const onPress = (item, index) => {
    navigate(item?.route)
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => { onPress(item, index) }} style={styles.itemContainer}>
        <Text style={styles.title}>{item?.title}</Text>
        <Image source={ic_chevron_right} resizeMode="contain" style={styles.chevronRight} />
      </TouchableOpacity>
    );
  };

  const keyExtractor = useCallback((_, index) => {
    return index;
  }, []);

  const ItemSeparatorComponent = () => <Spacing size={10} />;

  const onScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            y: scrollY,
          },
        },
      },
    ],
    { useNativeDriver: false }
  );

  const height = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [120, 80],
    easing: Easing.linear,
    extrapolate: 'clamp'
  });

  const fontSize = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [60, 40],
    easing: Easing.linear,
    extrapolate: 'clamp'
  })


  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={styles.wrapper}>
        <Animated.View style={{ height: height, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors?.header?.borderBottomColor }}>
          <Animated.Text style={[styles.headerText, { fontSize }]}>Explore</Animated.Text>
        </Animated.View>
        <AnimatedFlashList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={heightPixel(50)}
          ItemSeparatorComponent={ItemSeparatorComponent}
          contentContainerStyle={styles.contentContainerStyle}
          onScroll={onScroll}
          scrollEventThrottle={16}
          bounces={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Explore;

const createStyle = (colors) => {
  return StyleSheet.create({
    wrapper: { flex: 1, },
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
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    contentContainerStyle: { paddingBottom: heightPixel(100), paddingVertical: sizes.paddingVertical },
    title: {
      ...typography.fontStyles.nunitoBold,
    },
    chevronRight: {
      width: normalize(20),
      height: normalize(20)
    },
    headerText: {
      fontSize: fontPixel(60),
      color: 'black',
      ...typography.fontStyles.nunitoBold,
      color: colors?.header?.color
    }
  });
};

const data = [
  {
    title: "Dashboard Animation",
    discretion: "",
    route: ROUTES.SCREENS.DASHBOARD_ANIMATION_SCREEN
  },
  {
    title: "Sound Wave",
    discretion: "",
    route: ROUTES.SCREENS.SOUND_WAVE_SCREEN
  },
  {
    title: "Dynamic Counter Animation",
    discretion: "",
    route: ROUTES.SCREENS.DISCORD_REACTION_BUTTON_SCREEN
  },
  {
    title: "Ripple Button",
    discretion: "",
    route: ROUTES.SCREENS.RIPPLE_BUTTON_SCREEN
  },
  {
    title: "Circular Progress Bar",
    discretion: "",
    route: ROUTES.SCREENS.RANDOM_CIRCULAR_PROGRESS_BAR_SCREEN
  },
  {
    title: "Tap to Pop Counter",
    discretion: "",
    route: ROUTES.SCREENS.TAP_TO_POP_COUNTER_SCREEN
  },
  {
    title: "Rotating Scaling Box",
    discretion: "",
    route: ROUTES.SCREENS.ROTATING_SCALING_BOX_SCREEN
  },
  {
    title: "Changing Color Box",
    discretion: "",
    route: ROUTES.SCREENS.COLOR_CHANGING_BOX_ANIMATION_SCREEN
  },
];
