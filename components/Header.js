import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";

const Header = () => {
  const tw = useTailwind();
  const navigation = useNavigation();
  return (
    <View
      style={tw(
        `flex flex-row px-3 py-3 w-full bg-blue-500 ${
          Platform.OS === "android" && "pt-10"
        }`
      )}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeftIcon style={tw("text-white")} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
