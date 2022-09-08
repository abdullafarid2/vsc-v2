import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { useTailwind } from "tailwindcss-react-native";
import { useNavigation } from "@react-navigation/native";

const ShopHeader = () => {
  const tw = useTailwind();
  const navigation = useNavigation();
  return (
    <View
      className={`flex flex-row px-3 py-3 w-full bg-blue-500 ${
        Platform.OS === "android" && "pt-10"
      }`}
    >
      <View className="">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon style={tw("text-white")} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-end">
        <TouchableOpacity>
          <MagnifyingGlassIcon size={30} style={tw("text-white")} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShopHeader;
