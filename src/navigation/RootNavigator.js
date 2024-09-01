import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROUTES } from "../constants";
import { DashboardAnimationScreen, DiscordReactionButtonScreen, Explore, MyProfile, RippleButtonScreen, Settings, TapToPopCounterScreen } from "../screens";
import { colors } from "../theme";
import { navigationRef } from "./NavigationUtils";
import { useDispatch, useSelector } from "react-redux";
import { useColorScheme } from 'react-native';
import { setMode } from "../redux/slice/globalSlice";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const RootNavigator = () => {
  const global = useSelector(state => state?.global)
  const dispatch = useDispatch()
  const routeNameRef = React.createRef();
  const styles = createStyle();
  const colorScheme = useColorScheme();

  useEffect(() => {
    dispatch(setMode(colorScheme === 'dark' ? true : false))
  }, [])

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <View style={styles.wrapper}>
        <NavigationContainer
          key={"NavigationContainer"}
          ref={navigationRef}
          theme={global?.isDarkTheme ? colors?.dark : colors?.light}
          onReady={() => {
            routeNameRef.current =
              navigationRef.current.getCurrentRoute()?.name;
          }}
          onStateChange={() => {
            const currentRouteName =
              navigationRef.current.getCurrentRoute()?.name;
            console.log("ScreenName", currentRouteName);
            routeNameRef.current = currentRouteName;
          }}
        >
          <Stack.Navigator key={"Stack.Navigator"} initialRouteName="Tabs">
            <Stack.Screen
              key={ROUTES.TAB}
              name={ROUTES.TAB}
              component={Tabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.DASHBOARD_ANIMATION_SCREEN}
              name={ROUTES.SCREENS.DASHBOARD_ANIMATION_SCREEN}
              component={DashboardAnimationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.DISCORD_REACTION_BUTTON_SCREEN}
              name={ROUTES.SCREENS.DISCORD_REACTION_BUTTON_SCREEN}
              component={DiscordReactionButtonScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.TAP_TO_POP_COUNTER_SCREEN}
              name={ROUTES.SCREENS.TAP_TO_POP_COUNTER_SCREEN}
              component={TapToPopCounterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              key={ROUTES.SCREENS.RIPPLE_BUTTON_SCREEN}
              name={ROUTES.SCREENS.RIPPLE_BUTTON_SCREEN}
              component={RippleButtonScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaView>
  );
};

const Tabs = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      key={"Tab.Navigator"}
      initialRouteName={ROUTES.TABS.MY_PROFILE}
      screenOptions={{
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: "transparent",
            shadowColor: 'transparent',
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            overflow: 'hidden',
          },
          android: {
            backgroundColor: "transparent",
            shadowColor: 'transparent',
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            overflow: 'hidden',
          },
        }),
        tabBarBackground: () => {
          return (
            <BlurView
              blurType={true ? "dark" : "light"}
              blurAmount={8}
              style={StyleSheet.absoluteFill}
            />
          );
        },
      }}
    >
      <Tab.Screen
        key={ROUTES.TABS.MY_PROFILE}
        name={ROUTES.TABS.MY_PROFILE}
        component={MyProfile}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
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
        key={ROUTES.TABS.EXPLORE}
        name={ROUTES.TABS.EXPLORE}
        component={Explore}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
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
          tabBarIcon: ({ focused }) => {
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
          tabBarLabel: ({ focused }) => {
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
      backgroundColor: "white",
    },
    wrapper: {
      flex: 1,
    },
  });
};
