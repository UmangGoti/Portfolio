import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity } from 'react-native';

export default function ToggleButton({ onPressToggle = (p0: boolean) => { }, isToggleOn = true }) {
    const positionButton = useRef(new Animated.Value(0)).current;

    const [isOn, setIsOn] = useState<boolean>(isToggleOn);
    useEffect(() => {
        setUp()
    }, []);

    const setUp = () => {
        if (isToggleOn) {
            setIsOn(isToggleOn)
            startAnimToOn()
        }
    }

    const startAnimToOff = () => {
        Animated.timing(positionButton, {
            toValue: 0,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: false,
        }).start();
    };

    const startAnimToOn = () => {
        Animated.timing(positionButton, {
            toValue: 1,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: false,
        }).start();
    };

    const positionInterPol = positionButton.interpolate({
        inputRange: [0, 1],
        outputRange: [4, 28],
    });

    const backgroundColorAnim = positionButton.interpolate({
        inputRange: [0, 1],
        outputRange: ['#dcdcdd', 'rgba(48, 209, 88, 1)'],
    });

    const roundViewColorAnim = positionButton.interpolate({
        inputRange: [0, 1],
        outputRange: ['#fff', '#fff'],
    });

    const onPress = () => {
        if (isOn) {
            startAnimToOff();
            setIsOn(false);
        } else {
            startAnimToOn();
            setIsOn(true);
        }
        onPressToggle(!isOn);
    };

    return (
        <TouchableOpacity
            style={{ height: 30, width: 30, alignItems: 'center' }}
            activeOpacity={0.9}
            onPress={onPress}>
            <Animated.View
                style={[
                    styles.mainStyes,
                    {
                        backgroundColor: backgroundColorAnim,
                    },
                ]}>
                <Animated.View
                    style={[
                        styles.basicStyle,
                        { backgroundColor: roundViewColorAnim },
                        {
                            transform: [
                                {
                                    translateX: positionInterPol,
                                },
                            ],
                        },
                    ]}
                />
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    basicStyle: {
        height: 28,
        width: 28,
        borderRadius: 20,
        shadowOffset: { width: -2, height: 4 },
        shadowColor: '#171717',
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    mainStyes: {
        borderRadius: 30,
        backgroundColor: '#fff',
        height: 34,
        width: 60,
        justifyContent: 'center',
    },
});