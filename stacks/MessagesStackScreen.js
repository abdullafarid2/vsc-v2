import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessagesScreen from "../screens/MessagesScreen";
import { useTailwind } from "tailwindcss-react-native";
import ChatScreen from "../screens/ChatScreen";

const MessagesStack = createNativeStackNavigator();

const MessagesStackScreen = () => {
  const tw = useTailwind();
  return (
    <MessagesStack.Navigator>
      <MessagesStack.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          headerStyle: tw("bg-blue-500"),
          headerTitleStyle: tw("text-white"),
        }}
      />
      <MessagesStack.Screen name="Chat" component={ChatScreen} />
    </MessagesStack.Navigator>
  );
};

export default MessagesStackScreen;
