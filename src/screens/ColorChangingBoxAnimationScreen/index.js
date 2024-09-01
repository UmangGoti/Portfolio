import { useTheme } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { normalize } from '../../theme';

const ColorChangingBoxAnimationScreen = () => {
    const boxColor = [
        'rgb(255,73,74)',
        'rgb(255,170,0)',
        'rgb(0,163,217)',
        'rgb(0,163,217)',
        'rgb(115,92,255)',
        'rgb(255,73,74)',
    ];

    const { colors } = useTheme();
    const styles = createStyle(colors)

    const colorAnimation = useSharedValue(0);
    const calculatedColor = useDerivedValue(
        () => interpolateColor(colorAnimation.value, [0, 1, 2, 3, 4, 5], boxColor),
        [colorAnimation],
    );

    useEffect(() => {
        colorAnimation.value = withRepeat(
            withTiming(6, {
                duration: 3000,
                easing: Easing.linear,
            }),
            -1,
            true,
        );
    }, [colorAnimation]);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: calculatedColor.value,
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.animatedBoxContainer, animatedStyles]} />
        </View>
    );
};

export default ColorChangingBoxAnimationScreen;

const createStyle = (colors) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        animatedBoxContainer: {
            width: normalize(200),
            height: normalize(200),
            borderRadius: normalize(12),
            backgroundColor: colors.blue,
        },
    });
}