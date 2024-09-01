import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { colors, normalize, typography } from '../../theme';
import { useTheme } from '@react-navigation/native';

const boxHeight = normalize(100);
const translateY = boxHeight + normalize(15);

const TapToPopCounterScreen = () => {
    const scale = useSharedValue(1);
    const y = useSharedValue(0);
    const [count, setCount] = useState(0);
    const { colors } = useTheme()
    const styles = createStyle(colors)
    useEffect(() => { }, [count]);

    const tap = Gesture.Tap()
        .onBegin(() => {
            scale.value = withSpring(0.8);
        })
        .onFinalize(() => {
            scale.value = withSpring(1);
            y.value = withTiming(
                1,
                {
                    duration: 400,
                    mass: 1,
                    damping: 100,
                    stiffness: 1,
                    easing: Easing.out(Easing.quad),
                },
                () => {
                    y.value = withTiming(0, {
                        duration: 900,
                        easing: Easing.out(Easing.quad),
                    });
                },
            );
            runOnJS(setCount)(count + 1);
        });



    const animatedBoxScale = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const animatedTextPopUp = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: withSpring(
                        interpolate(y.value, [0, 1], [0, -translateY]),
                    ),
                },
            ],
            opacity: withSpring(interpolate(y.value, [0, 1], [0, 1])),
        };
    });

    return (
        <View style={styles.container}>
            <GestureDetector gesture={tap}>
                <View style={styles.gestureContainer}>
                    <Animated.View style={[styles.countContainer, animatedTextPopUp]}>
                        <Text style={styles.count}>{count}</Text>
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.animatedBoxContainer,
                            animatedBoxScale,
                        ]} />
                </View>
            </GestureDetector>
        </View>
    );
};

export default TapToPopCounterScreen;

const createStyle = (colors) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors?.background,
            alignItems: 'center',
            justifyContent: 'center'
        },
        animatedBoxContainer: {
            width: boxHeight,
            height: boxHeight,
            borderRadius: normalize(12),
            backgroundColor: colors.blue,
            justifyContent: 'center',
            alignItems: 'center',
        },
        gestureContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        countContainer: {
            borderRadius: normalize(8),
            paddingLeft: normalize(20),
            paddingRight: normalize(20),
            paddingTop: normalize(10),
            paddingBottom: normalize(10),
            backgroundColor: colors.blue,
            borderWidth: 1,
            borderColor: colors.blue,
            position: 'absolute',
        },
        count: {
            color: colors.white,
            fontSize: 15,
            ...typography.fontStyles.nunitoBold,
        },
    })
};