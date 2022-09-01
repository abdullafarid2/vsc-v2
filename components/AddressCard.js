import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";

const AddressCard = ({ id, name, area, road, block, building, flat }) => {
  const tw = useTailwind();
  const navigation = useNavigation();
  return (
    <View className="border border-gray-200 rounded-lg mb-3 px-3 py-3">
      <View className="flex-1 flex-row">
        <View className="flex-1">
          <Text className="text-black font-semibold text-lg">{name}</Text>
          <Text className="font-semibold">{area}</Text>

          {flat === null ? (
            <Text>
              {road}, {block}, {building}
            </Text>
          ) : (
            <Text>
              {road}, {block}, {building}, {flat}
            </Text>
          )}
        </View>

        <TouchableOpacity
          className="justify-center items-center"
          onPress={() =>
            navigation.navigate("EditAddress", {
              id,
            })
          }
        >
          <ChevronRightIcon style={tw("text-gray-400")} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddressCard;
