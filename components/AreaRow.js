import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import useAuth from "../hooks/useAuth";
import { CheckIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";

const AreaRow = ({ value, id }) => {
  const tw = useTailwind();
  const { user } = useAuth();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className="flex flex-row border-b border-gray-200 py-2 items-center"
      onPress={() => {
        user.address[id].area = value;
        navigation.goBack();
      }}
    >
      <Text>{value}</Text>

      {user.address[id].area === value && (
        <View className="flex-1 flex-row justify-end">
          <CheckIcon style={tw("text-blue-500")} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default AreaRow;
