import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';
import { fontPixel, normalize, typography } from '../../theme';
import { useTheme } from '@react-navigation/native';
import { Spacing } from '../../components';

const ANIMATION_DURATION = 200;
const ANIMATION_DELAY = 80;
const FONT_SIZE = 60;
const ANIMATION_DISTANCE = FONT_SIZE + 60;

const DynamicCounterAnimation = () => {
    const oldCount = useSharedValue(-1);
    const newCount = useSharedValue(0);
    const byYou = useSharedValue(false);
    const [count, setCount] = useState(0);
    const { colors } = useTheme()
    const styles = createStyle(colors)

    useEffect(() => {
        newCount.value = count;
    }, [count, newCount]);

    const entering = values => {
        'worklet';
        if (oldCount.value === -1) {
            oldCount.value = count;
            return { initialValues: {}, animations: {} };
        }

        const offset = (oldCount.value < count ? 1 : -1) * ANIMATION_DISTANCE;
        oldCount.value = count;
        const animations = {
            originY: withDelay(
                ANIMATION_DELAY,
                withTiming(values.targetOriginY, { duration: ANIMATION_DURATION }),
            ),
        };
        const initialValues = {
            originY: values.targetOriginY + offset,
        };
        return {
            initialValues,
            animations,
        };
    };

    const exiting = values => {
        'worklet';
        const offset =
            (count > (newCount.value ?? count) ? 1 : -1) * ANIMATION_DISTANCE;
        const animations = {
            originY: withDelay(
                ANIMATION_DELAY,
                withTiming(values.currentOriginY + offset, {
                    duration: ANIMATION_DURATION,
                }),
            ),
        };
        const initialValues = {
            originY: values.currentOriginY,
        };
        return {
            initialValues,
            animations,
        };
    };

    const animatedStyles = useAnimatedStyle(() => {
        return {
            borderColor: withTiming(byYou.value ? '#00f' : '#000', {
                duration: 200,
            }),
            backgroundColor: withTiming(byYou.value ? 'rgba(0,0,255,0.3)' : '#fff', {
                duration: 200,
            }),
        };
    });

    const animatedFontStyle = useAnimatedStyle(() => {
        return {
            color: withTiming(byYou.value ? '#00f' : '#000', {
                duration: 200,
            }),
        };
    });

    const onPressAdd = () => {
        setCount(count + 1);
    };

    const onPressSubtract = () => {
        if (count > 0) {
            if (!byYou.value) {
                setCount(count - 1);
            } else {
                if (byYou.value && count > 1) {
                    setCount(count - 1);
                }
            }
        }
    };

    const onPressCountBox = () => {
        if (!byYou.value) {
            setCount(count + 1);
        } else {
            setCount(count - 1);
        }
        byYou.value = !byYou.value;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPressCountBox}>
                <Animated.View style={[styles.animatedTextContainer, animatedStyles]}>
                    <Animated.Text
                        key={count}
                        entering={entering}
                        exiting={exiting}
                        style={[styles.animatedText, animatedFontStyle]}>
                        {count}
                    </Animated.Text>
                </Animated.View>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <Button onPress={onPressAdd} title={'+'} />
                <Spacing direction='x' size={normalize(60)} />
                <Button onPress={onPressSubtract} title={'-'} />
            </View>
        </View>
    );
};

const Button = ({ onPress, title }) => {
    const { colors } = useTheme()
    const styles = createStyle(colors)
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={styles.button}>
            <Text style={styles.buttonTitle}>{title}</Text>
        </TouchableOpacity>
    );
};

export default DynamicCounterAnimation;

const createStyle = (colors) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center'
        },
        animatedTextContainer: {
            overflow: 'hidden',
            borderWidth: 3,
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: normalize(80),
            paddingRight: normalize(80),
            paddingTop: normalize(1),
            paddingBottom: normalize(1),
            borderRadius: normalize(18),
        },
        animatedText: {
            ...typography.fontStyles.nunitoExtraBold,
            fontSize: FONT_SIZE,
        },
        button: {
            backgroundColor: '#000',
            width: normalize(40),
            height: normalize(40),
            borderRadius: normalize(12),
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonTitle: {
            ...typography.fontStyles.nunitoExtraBold,
            fontSize: fontPixel(20),
            color: '#fff',
        },
        buttonContainer: {
            flexDirection: 'row',
            marginTop: normalize(20),
        },
    });
}