import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import Header from "../components/Header";
import { useTailwind } from "tailwindcss-react-native";

const AccountScreen = () => {
  const navigation = useNavigation();
  const tw = useTailwind();

  const { logout } = useAuth();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <Header />

      <View className="flex-1 bg-white px-3">
        <View className="flex flex-row mt-5">
          <Text className="text-black font-bold text-2xl">My Account</Text>
        </View>

        <View className="flex justify-center items-center mt-6">
          <TouchableOpacity
            className="flex flex-row bg-gray-200 border border-gray-400 rounded-lg w-full px-5 py-5"
            onPress={() => navigation.navigate("AccountDetails")}
          >
            <Text className="text-lg font-semibold">Account Details</Text>
            <View className="flex-1 flex-row items-center justify-end">
              <ChevronRightIcon style={tw("text-black font-semibold")} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-row bg-gray-200 border border-gray-400 rounded-lg w-full px-5 py-5 mt-4"
            onPress={() => navigation.navigate("UserOrders")}
          >
            <Text className="text-lg font-semibold">My Orders</Text>
            <View className="flex-1 flex-row items-center justify-end">
              <ChevronRightIcon style={tw("text-black font-semibold")} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-row bg-gray-200 border border-gray-400 rounded-lg w-full px-5 py-5 mt-4"
            onPress={() => navigation.navigate("UserAddresses")}
          >
            <Text className="text-lg font-semibold">My Addresses</Text>
            <View className="flex-1 flex-row items-center justify-end">
              <ChevronRightIcon style={tw("text-black font-semibold")} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-row bg-gray-200 border border-gray-400 rounded-lg w-full px-5 py-5 mt-4"
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <Text className="text-lg font-semibold">Change Password</Text>
            <View className="flex-1 flex-row items-center justify-end">
              <ChevronRightIcon style={tw("text-black font-semibold")} />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-blue-500 rounded rounded-lg px-5 py-3 mt-8"
          onPress={() => logout()}
        >
          <Text className="text-white font-bold text-lg text-center">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;
