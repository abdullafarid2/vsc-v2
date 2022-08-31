import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import useAuth from "./hooks/useAuth";
// import HomeStackScreen from "./stacks/HomeStackScreen";
// import { useTailwind } from "tailwind-rn/dist";
// import {
//     BellIcon as BellIconSolid,
//     ChatIcon as ChatIconSolid,
//     HomeIcon as HomeIconSolid,
//     TagIcon as TagIconSolid,
// } from "react-native-heroicons/solid";
// import {
//     BellIcon,
//     ChatIcon,
//     HomeIcon,
//     TagIcon,
// } from "react-native-heroicons/outline";
// import UserShopsStackScreen from "./stacks/UserShopsStackScreen";
// import NotificationsStackScreen from "./stacks/NotificationsStackScreen";
// import MessagesStackScreen from "./stacks/MessagesStackScreen";

const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

const StackNavigator = () => {
  // const { user } = useAuth();
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StackNavigator;
