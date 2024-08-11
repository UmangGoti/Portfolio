import { DefaultTheme } from "@react-navigation/native";
import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// 430x932 is scale of iPhone 15 Pro Max.
const widthBaseScale = SCREEN_WIDTH / 430;
const heightBaseScale = SCREEN_HEIGHT / 932;

// For responsive UI design. https://medium.com/nerd-for-tech/react-native-styles-normalization-e8ce77a3110c
const normalize = (size, based = "width") => {
  const newSize =
    based === "height" ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// For width pixel.
const widthPixel = (size) => {
  return normalize(size, "width");
};

// For height pixel.
const heightPixel = (size) => {
  return normalize(size, "height");
};

// For font pixel.
const fontPixel = (size) => {
  return heightPixel(size);
};

// For Margin and Padding vertical pixel.
const pixelSizeVertical = (size) => {
  return heightPixel(size);
};

// For Margin and Padding horizontal pixel.
const pixelSizeHorizontal = (size) => {
  return widthPixel(size);
};

export {
  widthPixel,
  heightPixel,
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
};

// colors
export const colors = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "rgb(255, 255, 255)",
      text: "rgb(0, 0, 0)",
      tabIconColor: "rgba(0,0,0,0.5)",
      tabIconColorFocused: "rgb(0,0,0)",
    },
  },
  dark: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "rgb(0, 0, 0)",
      text: "rgb(255,255,255)",
      tabIconColor: "rgba(255,255,255,0.5)",
      tabIconColorFocused: "rgb(255,255,255)",
    },
  },
};
