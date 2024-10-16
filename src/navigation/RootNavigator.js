import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {BlurView} from 'expo-blur';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect} from 'react';
import {Platform, StyleSheet, useColorScheme, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../constants';
import {STORAGE} from '../constants/storage';
import {setMode} from '../redux/slice/globalSlice';
import {
  BounceAnimationScreen,
  BubbleSortScreen,
  ColorChangingBoxAnimationScreen,
  DashboardAnimationScreen,
  DiscordReactionButtonScreen,
  Explore,
  FlipAnimationScreen,
  Language,
  MyProfile,
  PasscodeScreen,
  RandomCircularProgressBarScreen,
  RippleButtonScreen,
  RotatingScalingBoxScreen,
  Settings,
  SoundWaveScreen,
  TapToPopCounterScreen,
  TextMorpherScreen,
  Wallet,
} from '../screens';
import {colors} from '../theme';
import {navigationRef} from './NavigationUtils';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const RootNavigator = ({local}) => {
  const global = useSelector(state => state?.global);
  const dispatch = useDispatch();
  const routeNameRef = React.createRef();
  const styles = createStyle();
  const colorScheme = useColorScheme();
  useEffect(() => {
    setUp();
  }, []);

  const setUp = async () => {
    const mode = await AsyncStorage.getItem(STORAGE.MODE);
    dispatch(setMode((mode || colorScheme) === 'dark' ? true : false));
  };

  return (
    <SafeAreaView
      style={[
        styles.safeAreaViewContainer,
        {backgroundColor: global?.isDarkTheme ? '#000' : '#fff'},
      ]}>
      <StatusBar
        backgroundColor={global?.isDarkTheme ? '#000' : '#fff'}
        style={global?.isDarkTheme ? 'light' : 'dark'}
      />
      <View style={styles.wrapper}>
        <NavigationContainer
          key={'NavigationContainer'}
          ref={navigationRef}
          theme={global?.isDarkTheme ? colors?.dark : colors?.light}
          onReady={() => {
            routeNameRef.current =
              navigationRef.current.getCurrentRoute()?.name;
          }}
          onStateChange={() => {
            const currentRouteName =
              navigationRef.current.getCurrentRoute()?.name;
            console.log('ScreenName', currentRouteName);
            routeNameRef.current = currentRouteName;
          }}>
          <Stack.Navigator key={'Stack.Navigator'} initialRouteName="Tabs">
            <Stack.Screen
              key={ROUTES.TAB}
              name={ROUTES.TAB}
              component={Tabs}
              options={{headerShown: false}}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.DASHBOARD_ANIMATION_SCREEN}
              name={ROUTES.SCREENS.DASHBOARD_ANIMATION_SCREEN}
              component={DashboardAnimationScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.DISCORD_REACTION_BUTTON_SCREEN}
              name={ROUTES.SCREENS.DISCORD_REACTION_BUTTON_SCREEN}
              component={DiscordReactionButtonScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.TAP_TO_POP_COUNTER_SCREEN}
              name={ROUTES.SCREENS.TAP_TO_POP_COUNTER_SCREEN}
              component={TapToPopCounterScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.RIPPLE_BUTTON_SCREEN}
              name={ROUTES.SCREENS.RIPPLE_BUTTON_SCREEN}
              component={RippleButtonScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.ROTATING_SCALING_BOX_SCREEN}
              name={ROUTES.SCREENS.ROTATING_SCALING_BOX_SCREEN}
              component={RotatingScalingBoxScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.RANDOM_CIRCULAR_PROGRESS_BAR_SCREEN}
              name={ROUTES.SCREENS.RANDOM_CIRCULAR_PROGRESS_BAR_SCREEN}
              component={RandomCircularProgressBarScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.SOUND_WAVE_SCREEN}
              name={ROUTES.SCREENS.SOUND_WAVE_SCREEN}
              component={SoundWaveScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.COLOR_CHANGING_BOX_ANIMATION_SCREEN}
              name={ROUTES.SCREENS.COLOR_CHANGING_BOX_ANIMATION_SCREEN}
              component={ColorChangingBoxAnimationScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.LANGUAGE_SCREEN}
              name={ROUTES.SCREENS.LANGUAGE_SCREEN}
              component={Language}
              options={{headerShown: false}}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.TEXT_MORPHER_SCREEN}
              name={ROUTES.SCREENS.TEXT_MORPHER_SCREEN}
              component={TextMorpherScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.BOUNCE_ANIMATION_SCREEN}
              name={ROUTES.SCREENS.BOUNCE_ANIMATION_SCREEN}
              component={BounceAnimationScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.FLIP_ANIMATION_SCREEN}
              name={ROUTES.SCREENS.FLIP_ANIMATION_SCREEN}
              component={FlipAnimationScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.BUBBLE_SORT_SCREEN}
              name={ROUTES.SCREENS.BUBBLE_SORT_SCREEN}
              component={BubbleSortScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.PASSCODE_SCREEN}
              name={ROUTES.SCREENS.PASSCODE_SCREEN}
              component={PasscodeScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaView>
  );
};

const Tabs = () => {
  const {colors} = useTheme();
  const global = useSelector(state => state?.global);
  return (
    <Tab.Navigator
      key={'Tab.Navigator'}
      initialRouteName={ROUTES.TABS.MY_PROFILE}
      screenOptions={{
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: 'transparent',
            shadowColor: 'transparent',
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            overflow: 'hidden',
            position: 'absolute',
          },
          android: {
            backgroundColor: global?.isDarkTheme
              ? 'rgba(0,0,0,0.9)'
              : 'rgba(255,255,255,0.9)',
            shadowColor: 'transparent',
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            overflow: 'hidden',
            position: 'absolute',
          },
        }),
        tabBarBackground: () => {
          return (
            <BlurView
              blurType={global?.isDarkTheme ? 'dark' : 'light'}
              blurAmount={10}
              style={StyleSheet.absoluteFill}
            />
          );
        },
      }}>
      <Tab.Screen
        key={ROUTES.TABS.MY_PROFILE}
        name={ROUTES.TABS.MY_PROFILE}
        component={MyProfile}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <FontAwesome
                name="user"
                size={24}
                color={
                  focused ? colors?.tabIconColorFocused : colors?.tabIconColor
                }
              />
            );
          },
          tabBarLabel: () => {
            return <></>;
          },
        }}
      />
      <Tab.Screen
        key={ROUTES.TABS.WALLET}
        name={ROUTES.TABS.WALLET}
        component={Wallet}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <MaterialIcons
                name="wallet"
                size={24}
                color={
                  focused ? colors?.tabIconColorFocused : colors?.tabIconColor
                }
              />
            );
          },
          tabBarLabel: () => {
            return <></>;
          },
        }}
      />
      <Tab.Screen
        key={ROUTES.TABS.EXPLORE}
        name={ROUTES.TABS.EXPLORE}
        component={Explore}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <MaterialIcons
                name="explore"
                size={24}
                color={
                  focused ? colors?.tabIconColorFocused : colors?.tabIconColor
                }
              />
            );
          },
          tabBarLabel: () => {
            return <></>;
          },
        }}
      />
      <Tab.Screen
        key={ROUTES.TABS.SETTINGS}
        name={ROUTES.TABS.SETTINGS}
        component={Settings}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <MaterialIcons
                name="settings"
                size={24}
                color={
                  focused ? colors?.tabIconColorFocused : colors?.tabIconColor
                }
              />
            );
          },
          tabBarLabel: ({focused}) => {
            return <></>;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default RootNavigator;

const createStyle = () => {
  return StyleSheet.create({
    safeAreaViewContainer: {
      flex: 1,
      backgroundColor: 'white',
    },
    wrapper: {
      flex: 1,
    },
  });
};
