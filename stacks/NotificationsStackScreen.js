import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTailwind } from "tailwind-rn/dist";
import NotificationsScreen from "../screens/NotificationsScreen";

const NotificationsStack = createNativeStackNavigator();

const NotificationsStackScreen = () => {
  const tw = useTailwind();

  return (
    <NotificationsStack.Navigator>
      <NotificationsStack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
    </NotificationsStack.Navigator>
  );
};

export default NotificationsStackScreen;
