import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import useShops from "../hooks/useShops";
import { CheckCircleIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";

const ShopCreatedSuccess = () => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const { getShops } = useShops();

  useEffect(() => {
    getShops();
  }, []);

  return (
    <View className="flex-1 bg-white justify-center items-center px-3">
      <CheckCircleIcon size={60} style={tw("text-green-600")} />

      <Text className="font-bold text-xl mt-2">Success!</Text>

      <Text className="font-semibold text-lg mt-2">
        Your shop has been created successfully.
      </Text>

      <Text className="font-semibold text-lg mt-2 text-center">
        Tap on the button below to start customizing your shop.
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("Shops")}
        className="bg-blue-500 rounded rounded-lg p-3 w-full mt-5"
      >
        <Text className="font-semibold text-white text-lg text-center">
          Go to My Shops
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShopCreatedSuccess;
