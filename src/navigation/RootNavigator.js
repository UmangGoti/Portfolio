import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigationRef } from "./NavigationUtils";
import { ROUTES } from "../constants";
import { Explore, MyProfile, Settings } from "../screens";
import React from "react";

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
  return (
    <Tab.Navigator key={'Tab.Navigator'} initialRouteName={ROUTES.TABS.MY_PROFILE}>
      <Tab.Screen
        key={ROUTES.TABS.MY_PROFILE}
        name={ROUTES.TABS.MY_PROFILE}
        component={MyProfile}
        options={{
          headerShown:false
        }}
      />
      <Tab.Screen
        key={ROUTES.TABS.EXPLORE}
        name={ROUTES.TABS.EXPLORE}
        component={Explore}
        options={{
          headerShown:false
        }}
      />
      <Tab.Screen
        key={ROUTES.TABS.SETTINGS}
        name={ROUTES.TABS.SETTINGS}
        component={Settings}
        options={{
          headerShown:false
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
