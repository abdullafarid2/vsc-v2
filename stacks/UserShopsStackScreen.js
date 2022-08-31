import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTailwind } from "tailwind-rn/dist";
import UserShopsScreen from "../screens/UserShopsScreen";
import CreateShop from "../screens/CreateShopScreen";
import CreateShop2 from "../screens/CreateShopScreen2";
import CreateShop3 from "../screens/CreateShopScreen3";
import ShopCreatedSuccessScreen from "../screens/ShopCreatedSuccessScreen";
import ShopScreen from "../screens/ShopScreen";

const UserShopsStack = createNativeStackNavigator();

const UserShopsStackScreen = () => {
  const tw = useTailwind();

  return (
    <UserShopsStack.Navigator>
      <UserShopsStack.Group screenOptions={{ headerShown: false }}>
        <UserShopsStack.Screen name="Shops" component={UserShopsScreen} />
        <UserShopsStack.Screen name="Shop" component={ShopScreen} />
        <UserShopsStack.Screen name="CreateShop" component={CreateShop} />
        <UserShopsStack.Screen name="CreateShop2" component={CreateShop2} />
        <UserShopsStack.Screen name="CreateShop3" component={CreateShop3} />
        <UserShopsStack.Screen
          name="ShopCreatedSuccess"
          component={ShopCreatedSuccessScreen}
        />
      </UserShopsStack.Group>
    </UserShopsStack.Navigator>
  );
};

export default UserShopsStackScreen;
