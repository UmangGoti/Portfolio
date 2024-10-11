import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useCallback, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { ic_chevron_right } from "../../assets/images";
import { ParallaxScrollView, Spacing } from "../../components";
import { ROUTES } from "../../constants";
import { navigate } from "../../navigation/NavigationUtils";
import {
  fontPixel,
  normalize,
  pixelSizeHorizontal,
  sizes,
  typography,
} from "../../theme";

const Explore = () => {
  const { colors } = useTheme();
  const styles = createStyle(colors);
  const scrollY = useRef(new Animated.Value(0)).current;
  const global = useSelector((state) => state?.global);

  const onPress = (item, index) => {
    navigate(item?.route);
  };

  const renderItem = useCallback((item, index) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.9}
        onPress={() => {
          onPress(item, index);
        }}
        style={styles.itemContainer}
      >
        <Text style={styles.title}>{item?.title}</Text>
        <Image
          source={ic_chevron_right}
          resizeMode="contain"
          style={styles.chevronRight}
        />
      </TouchableOpacity>
    );
  }, []);

  const ItemSeparatorComponent = () =>
    useCallback(() => <Spacing size={10} />, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={global?.isDarkTheme ? "#1D3D47" : "#A1CEDC"}
      headerImage={
        <Ionicons size={310} name="compass" style={styles.headerImage} />
      }
    >
      <View style={styles.wrapper}>
        <Text style={styles.headerText}>Explore</Text>
        {data.map(renderItem)}
        <Spacing size={100} />
      </View>
    </ParallaxScrollView>
  );
};

export default Explore;

const createStyle = (colors) => {
  return StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background,
      gap: 15,
      paddingHorizontal: sizes.paddingHorizontal,
      paddingVertical: sizes.paddingVertical,
    },
    itemContainer: {
      paddingHorizontal: pixelSizeHorizontal(20),
      paddingVertical: pixelSizeHorizontal(20),
      borderRadius: normalize(12),
      elevation: 5, // For Android shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 }, // For iOS shadow
      shadowOpacity: 0.2,
      shadowRadius: 2,
      backgroundColor: colors.white,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      maxHeight: normalize(60),
    },
    title: {
      ...typography.fontStyles.nunitoBold,
    },
    chevronRight: {
      width: normalize(20),
      height: normalize(20),
    },
    headerText: {
      fontSize: fontPixel(35),
      color: "black",
      ...typography.fontStyles.nunitoBold,
      color: colors?.header?.color,
    },
    headerImage: {
      color: "#fff",
      bottom: -90,
      left: -35,
      position: "absolute",
    },
  });
};

const data = [
  {
    title: "Dashboard Animation",
    discretion: "",
    route: ROUTES.SCREENS.DASHBOARD_ANIMATION_SCREEN,
  },
  {
    title: "Sound Wave",
    discretion: "",
    route: ROUTES.SCREENS.SOUND_WAVE_SCREEN,
  },
  {
    title: "Dynamic Counter Animation",
    discretion: "",
    route: ROUTES.SCREENS.DISCORD_REACTION_BUTTON_SCREEN,
  },
  {
    title: "Ripple Button",
    discretion: "",
    route: ROUTES.SCREENS.RIPPLE_BUTTON_SCREEN,
  },
  {
    title: "Circular Progress Bar",
    discretion: "",
    route: ROUTES.SCREENS.RANDOM_CIRCULAR_PROGRESS_BAR_SCREEN,
  },
  {
    title: "Tap to Pop Counter",
    discretion: "",
    route: ROUTES.SCREENS.TAP_TO_POP_COUNTER_SCREEN,
  },
  {
    title: "Rotating Scaling Box",
    discretion: "",
    route: ROUTES.SCREENS.ROTATING_SCALING_BOX_SCREEN,
  },
  {
    title: "Changing Color Box",
    discretion: "",
    route: ROUTES.SCREENS.COLOR_CHANGING_BOX_ANIMATION_SCREEN,
  },
  {
    title: "Text Morpher",
    discretion: "",
    route: ROUTES.SCREENS.TEXT_MORPHER_SCREEN,
  },
  {
    title: "Bounce Animations",
    discretion: "",
    route: ROUTES.SCREENS.BOUNCE_ANIMATION_SCREEN,
  },
  {
    title: "Flip Animations",
    discretion: "",
    route: ROUTES.SCREENS.FLIP_ANIMATION_SCREEN,
  },
  {
    title: "Bubble Sort Animations",
    discretion: "",
    route: ROUTES.SCREENS.BUBBLE_SORT_SCREEN,
  },
  {
    title: "Passcode UI",
    discretion: "",
    route: ROUTES.SCREENS.PASSCODE_SCREEN,
  },
];
