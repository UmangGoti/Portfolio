import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROUTES } from "../constants";
import { Explore, MyProfile, Settings } from "../screens";
import { colors } from "../theme";
import { navigationRef } from "./NavigationUtils";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const RootNavigator = () => {
  const routeNameRef = React.createRef();
  const styles = createStyle();

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <View style={styles.wrapper}>
        <NavigationContainer
          key={"NavigationContainer"}
          ref={navigationRef}
          theme={true ? colors?.dark : colors?.light}
          onReady={() => {
            routeNameRef.current =
              navigationRef.current.getCurrentRoute()?.name;
          }}
          onStateChange={() => {
            const currentRouteName =
              navigationRef.current.getCurrentRoute()?.name;
            console.log("screen name", currentRouteName);
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
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaView>
  );
};

const Tabs = () => {
  const { colors } = useTheme();
  console.log(colors);
  return (
    <Tab.Navigator
      key={"Tab.Navigator"}
      initialRouteName={ROUTES.TABS.MY_PROFILE}
      screenOptions={{
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: "transparent",
          },
          android: {
            backgroundColor: "transparent",
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
