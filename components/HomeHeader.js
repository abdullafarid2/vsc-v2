import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { UserIcon } from "react-native-heroicons/solid";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";

const HomeHeader = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const tw = useTailwind();

  return (
    <View className="flex flex-row bg-blue-500 px-5 pb-3 pt-2">
      <TouchableOpacity
        className="border border-gray-200 rounded-full p-2 bg-gray-200 justify-start"
        onPress={() => {
          navigation.navigate("Account");
        }}
      >
        <UserIcon style={tw("text-black")} />
      </TouchableOpacity>

      <View className="flex-1 justify-center items-center">
        <Text className="text-white font-semibold text-lg">{route.name}</Text>
      </View>

      <TouchableOpacity
        className="border border-gray-200 rounded-full p-2 bg-gray-200 justify-start"
        onPress={() => navigation.navigate("SearchShop")}
      >
        <MagnifyingGlassIcon style={tw("text-black")} />
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;
