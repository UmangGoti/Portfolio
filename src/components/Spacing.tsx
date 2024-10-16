import React from 'react';
import {View, ViewStyle} from 'react-native';
import {heightPixel, widthPixel} from '../theme';

type SpacingProps = {
  size: number | string;
  direction?: 'X' | 'x' | 'row';
  style?: ViewStyle | ViewStyle[];
};

const Spacing: React.FC<SpacingProps> = ({size = 0, direction, style}) => {
  const defaultStyle: ViewStyle = {};

  if (direction === 'x' || direction === 'X' || direction === 'row') {
    defaultStyle.width = widthPixel(Number(size));
  } else {
    defaultStyle.height = heightPixel(Number(size));
  }

  return <View style={[defaultStyle, style]} />;
};

export default Spacing;
