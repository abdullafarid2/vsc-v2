import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTailwind } from "tailwind-rn/dist";
import MessagesScreen from "../screens/MessagesScreen";

const MessagesStack = createNativeStackNavigator();

const MessagesStackScreen = () => {
  const tw = useTailwind();

  return (
    <MessagesStack.Navigator>
      <MessagesStack.Screen name="Messages" component={MessagesScreen} />
    </MessagesStack.Navigator>
  );
};

export default MessagesStackScreen;
