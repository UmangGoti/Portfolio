import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Animated, Dimensions} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Device from '../utils/device';

const NetworkConnectionPrompt = () => {
  const [isConnected, setIsConnected] = useState(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial fade animation value
  const [translateAnim] = useState(new Animated.Value(0)); // Initial translate animation value
  const [hasCheckedInitialState, setHasCheckedInitialState] = useState(false); // Track if initial state is checked

  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    // Fetch initial network state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);

      // Show toast if there's no connection on the first load
      if (!state.isConnected) {
        showToast();
      }

      setHasCheckedInitialState(true); // Set the flag after initial state check
    });

    // Listen for network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      // Only show toast if the network state has changed after initial check
      if (hasCheckedInitialState && state.isConnected !== isConnected) {
        setIsConnected(state.isConnected);
        showToast(); // Show toast on network state change
      }
    });

    return () => {
      unsubscribe();
    };
  }, [hasCheckedInitialState, isConnected]);

  // Function to animate the toast
  const showToast = () => {
    setIsToastVisible(true);
    // Reset the translation to start off-screen
    translateAnim.setValue(screenHeight);

    // Fade in and slide up from outside the screen
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: screenHeight - 150, // Adjust to bring it into view
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Stay visible for a while
      setTimeout(() => {
        // Fade out and slide down
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateAnim, {
            toValue: screenHeight,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsToastVisible(false);
        });
      }, 2000);
    });
  };

  // Determine dot color based on network state
  const dotColor =
    isConnected === null ? 'gray' : isConnected ? '#21ff5c' : '#ff0000';

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          opacity: fadeAnim,
          transform: [{translateY: translateAnim}],
          left: isToastVisible ? 20 : Device.getDeviceWidth() + 200,
        },
      ]}>
      <View style={[styles.dot, {backgroundColor: dotColor}]} />
      <View width={10} />
      <Text style={styles.toastText}>
        {isConnected === null
          ? 'Checking your network...'
          : isConnected
            ? 'You are back online.'
            : 'You are offline, Please check your internet connection.'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5, // For Android shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2}, // For iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 1,
  },
  toastText: {
    color: 'white',
    fontSize: 12,
    marginRight: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default NetworkConnectionPrompt;
