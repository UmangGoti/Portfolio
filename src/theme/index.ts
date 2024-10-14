import { DefaultTheme } from "@react-navigation/native";
import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// 430x932 is scale of iPhone 15 Pro Max.
const widthBaseScale = SCREEN_WIDTH / 430;
const heightBaseScale = SCREEN_HEIGHT / 932;

// For responsive UI design. https://medium.com/nerd-for-tech/react-native-styles-normalization-e8ce77a3110c
const normalize = (size: number, based: "width" | "height" = "width") => {
  const newSize =
    based === "height" ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// For width pixel.
const widthPixel = (size: number) => {
  return normalize(size, "width");
};

// For height pixel.
const heightPixel = (size: number) => {
  return normalize(size, "height");
};

// For font pixel.
const fontPixel = (size: number) => {
  return heightPixel(size);
};

// For Margin and Padding vertical pixel.
const pixelSizeVertical = (size: number) => {
  return heightPixel(size);
};

// For Margin and Padding horizontal pixel.
const pixelSizeHorizontal = (size: number) => {
  return widthPixel(size);
};

export {
  fontPixel, heightPixel, normalize, pixelSizeHorizontal, pixelSizeVertical, widthPixel
};

const commonColors = {
  blue: 'rgb(0, 0, 255)',
  white: '#rgb(255,255,255)',
  black: '#rgb(0,0,0)',
  red: 'rgb(255, 0, 0)',
  green: 'rgb(0, 255, 0)',
  cyan: 'rgb(0, 255, 255)',
  magenta: 'rgb(255, 0, 255)',
  yellow: 'rgb(255, 255, 0)',
  purple: 'rgb(160, 32, 240)',
  gray: 'rgb(128,128,128)',
  transparent: 'transparent',
  appIcon: '#007AFF'
}

// colors
export const colors = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...commonColors,
      primary: "rgb(255, 255, 255)",
      background: "rgb(255, 255, 255)",
      text: "rgb(0, 0, 0)",
      tabIconColor: "rgba(0,0,0,0.5)",
      tabIconColorFocused: "rgb(0,0,0)",
      statusbar: "rgb(255, 255, 255)",
      borderColor: "rgb(0, 0, 0)",
      header: {
        color: '#000',
        borderBottomColor: '#000'
      },
      dynamicCounter: {
        borderColor: '#000',
        color: '#000',
        textColor: '#fff',
        backgroundColor: '#000',
        counterContainerColor: '#fff'
      },
      radioButton: {
        textColor: '#000',
        borderColor: '#000',
        radioColor: '#000',
      },
      bottomSheet: {
        backgroundColor: '#fff',
        panColor: 'rgba(0,0,0,0.4)',
        dividerLine: 'rgba(0,0,0,0.4)',
        overlay: 'rgba(0,0,0,0.4)',
        selectedItemBorderColor: 'rgba(0,0,0,0.4)',
        accountPicBorderColor: 'rgba(0,0,0,0.4)',
      }
    },
  },
  dark: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...commonColors,
      primary: "rgb(0, 0, 0)",
      background: "rgb(0, 0, 0)",
      text: "rgb(255,255,255)",
      tabIconColor: "rgba(255,255,255,0.5)",
      tabIconColorFocused: "rgb(255,255,255)",
      statusbar: "rgb(0, 0, 0)",
      borderColor: "rgb(255, 255, 255)",
      header: {
        color: '#fff',
        borderBottomColor: '#fff',
      },
      dynamicCounter: {
        borderColor: '#fff',
        color: '#fff',
        textColor: '#000',
        backgroundColor: '#fff',
        counterContainerColor: '#000',
      },
      radioButton: {
        textColor: '#fff',
        borderColor: '#fff',
        radioColor: '#fff',
      },
      bottomSheet: {
        backgroundColor: '#000',
        panColor: 'rgba(255,255,255,0.4)',
        dividerColor: 'rgba(255,255,255,0.4)',
        overlay: 'rgba(225,225,225,0.3)',
        selectedItemBorderColor: 'rgba(255,255,255,0.4)',
        accountPicBorderColor: 'rgba(255,255,255,0.4)',
      }
    },
  },
};

export const sizes = {
  paddingHorizontal: pixelSizeHorizontal(15),
  paddingVertical: pixelSizeHorizontal(15),
  marginHorizontal: pixelSizeHorizontal(15),
  marginVertical: pixelSizeHorizontal(15),
};

const fontWeights = {
  black: '900',
  extraBold: '800',
  bold: '700',
  semibold: '600',
  medium: '500',
  regular: '400',
  light: '300',
  extraLight: '200',
  thin: '100',
};

const fonts = {
  nunitoBlack: 'Nunito-Black.ttf',
  nunitoBold: 'Nunito-Bold.ttf',
  nunitoExtraBold: 'Nunito-ExtraBold.ttf',
  nunitoExtraLight: 'Nunito-ExtraLight.ttf',
  nunitoLight: 'Nunito-Light.ttf',
  nunitoMedium: 'Nunito-Medium.ttf',
  nunitoRegular: 'Nunito-Regular.ttf',
  nunitoSemiBold: 'Nunito-SemiBold.ttf',
  spaceMonoRegular: 'SpaceMono-Regular.ttf',
};

const fontStyles = {
  nunitoBlack: {
    fontWeight: fontWeights.black,
    fontFamily: fonts.nunitoBlack,
  },
  nunitoBold: {
    fontWeight: fontWeights.bold,
    fontFamily: fonts.nunitoBold,
  },
  nunitoExtraBold: {
    fontWeight: fontWeights.extraBold,
    fontFamily: fonts.nunitoExtraBold,
  },
  nunitoExtraLight: {
    fontWeight: fontWeights.extraLight,
    fontFamily: fonts.nunitoExtraLight,
  },
  nunitoLight: {
    fontWeight: fontWeights.light,
    fontFamily: fonts.nunitoLight,
  },
  nunitoMedium: {
    fontWeight: fontWeights.medium,
    fontFamily: fonts.nunitoMedium,
  },
  nunitoRegular: {
    fontWeight: fontWeights.regular,
    fontFamily: fonts.nunitoRegular,
  },
  nunitoSemiBold: {
    fontWeight: fontWeights.semibold,
    fontFamily: fonts.nunitoSemiBold,
  },
  spaceMonoRegular: {
    fontWeight: fontWeights.regular,
    fontFamily: fonts.spaceMonoRegular,
  },
}

export const typography = {
  fontWeights,
  fonts,
  fontStyles,
};
