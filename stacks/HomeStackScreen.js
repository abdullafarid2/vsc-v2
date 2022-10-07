import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import AccountScreen from "../screens/AccountScreen";
import SearchShopScreen from "../screens/SearchShopScreen";
import AccountDetailsScreen from "../screens/AccountDetailsScreen";
import UserOrdersScreen from "../screens/UserOrdersScreen";
import UserAddressesScreen from "../screens/UserAddressesScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import EditAddressScreen from "../screens/EditAddressScreen";
import SelectAreaScreen from "../screens/SelectAreaScreen";
import CreateAddressScreen from "../screens/CreateAddressScreen";
import CategoryScreen from "../screens/CategoryScreen";
import ShopScreen from "../screens/ShopScreen";
import { useTailwind } from "tailwindcss-react-native";
import SearchProductScreen from "../screens/SearchProductScreen";

const HomeStack = createNativeStackNavigator();

const HomeStackScreen = () => {
  const tw = useTailwind();
  return (
    <HomeStack.Navigator>
      <HomeStack.Group>
        <HomeStack.Screen name="Home" component={HomeScreen} />
        <HomeStack.Screen name="SearchShop" component={SearchShopScreen} />
        <HomeStack.Screen
          name="Shop"
          component={ShopScreen}
          options={{ headerShown: false }}
        />
      </HomeStack.Group>
      <HomeStack.Screen
        name={"SearchProduct"}
        component={SearchProductScreen}
      />

      <HomeStack.Group
        screenOptions={{
          headerStyle: tw("bg-blue-500"),
          headerTintColor: "#FFFFFF",
          headerTitle: "",
        }}
      >
        <HomeStack.Screen name="Account" component={AccountScreen} />
        <HomeStack.Screen
          name="AccountDetails"
          component={AccountDetailsScreen}
        />
        <HomeStack.Screen name="UserOrders" component={UserOrdersScreen} />
        <HomeStack.Screen
          name="UserAddresses"
          component={UserAddressesScreen}
        />
        <HomeStack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
        />
        <HomeStack.Screen name="EditAddress" component={EditAddressScreen} />
        <HomeStack.Screen name="SelectArea" component={SelectAreaScreen} />
        <HomeStack.Screen
          name="CreateAddress"
          component={CreateAddressScreen}
        />
      </HomeStack.Group>

      <HomeStack.Group
        screenOptions={{
          headerStyle: tw("bg-blue-500"),
          headerTintColor: "#FFFFFF",
          headerTitle: "",
        }}
      >
        <HomeStack.Screen name="Category" component={CategoryScreen} />
      </HomeStack.Group>
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
