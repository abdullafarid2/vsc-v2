import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import useAuth from "./hooks/useAuth";
import HomeStackScreen from "./stacks/HomeStackScreen";
import {
  BellIcon as BellIconSolid,
  ChatBubbleLeftIcon as ChatIconSolid,
  HomeIcon as HomeIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  TagIcon as TagIconSolid,
} from "react-native-heroicons/solid";
import {
  BellIcon,
  ChatBubbleLeftIcon,
  HomeIcon,
  ShoppingCartIcon,
  TagIcon,
} from "react-native-heroicons/outline";
import UserShopsStackScreen from "./stacks/UserShopsStackScreen";
import NotificationsStackScreen from "./stacks/NotificationsStackScreen";
import MessagesStackScreen from "./stacks/MessagesStackScreen";
import CartStackScreen from "./stacks/CartStack";
import { useTailwind } from "tailwindcss-react-native";
import useCart from "./hooks/useCart";
import useNotifications from "./hooks/useNotifications";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const StackNavigator = () => {
  const tw = useTailwind();
  const { user } = useAuth();
  const { cart, numberOfItems } = useCart();
  const { numberOfNotifications } = useNotifications();

  return (
    <>
      {user ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === "HomeStack") {
                return focused ? (
                  <HomeIconSolid size={size} color={color} />
                ) : (
                  <HomeIcon size={size} color={color} />
                );
              } else if (route.name === "UserShopsStack") {
                return focused ? (
                  <TagIconSolid size={size} color={color} />
                ) : (
                  <TagIcon size={size} color={color} />
                );
              } else if (route.name === "CartStack") {
                return focused ? (
                  <ShoppingCartIconSolid size={size} color={color} />
                ) : (
                  <ShoppingCartIcon size={size} color={color} />
                );
              } else if (route.name === "NotificationsStack") {
                return focused ? (
                  <BellIconSolid size={size} color={color} />
                ) : (
                  <BellIcon size={size} color={color} />
                );
              } else if (route.name === "MessagesStack")
                return focused ? (
                  <ChatIconSolid size={size} color={color} />
                ) : (
                  <ChatBubbleLeftIcon size={size} color={color} />
                );
            },
            tabBarActiveTintColor: "#0584F9",
            tabBarInactiveTintColor: "gray",
            headerShown: false,
          })}
        >
          <Tab.Screen
            name="HomeStack"
            component={HomeStackScreen}
            options={{ tabBarLabel: "Home" }}
          />
          <Tab.Screen
            name="UserShopsStack"
            component={UserShopsStackScreen}
            options={{ tabBarLabel: "My Shops" }}
          />
          <Tab.Screen
            name="CartStack"
            component={CartStackScreen}
            options={{
              tabBarLabel: "Cart",
              tabBarBadge: numberOfItems,
              tabBarBadgeStyle: tw(`${numberOfItems === 0 && "hidden"}`),
            }}
          />
          <Tab.Screen
            name="NotificationsStack"
            component={NotificationsStackScreen}
            options={{
              tabBarLabel: "Notifications",
              tabBarBadge: numberOfNotifications,
              tabBarBadgeStyle: tw(
                `${numberOfNotifications === 0 && "hidden"}`
              ),
            }}
          />
          <Tab.Screen
            name="MessagesStack"
            component={MessagesStackScreen}
            options={{
              tabBarLabel: "Messages",
              tabBarBadge: "",
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Group
            screenOptions={{ headerShown: false, gestureEnabled: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        </Stack.Navigator>
      )}
    </>
  );
};

export default StackNavigator;
