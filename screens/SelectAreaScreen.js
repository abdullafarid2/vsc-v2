import { View, Text, FlatList } from "react-native";
import React from "react";
import useAuth from "../hooks/useAuth";
import AreaRow from "../components/AreaRow";
import { useRoute } from "@react-navigation/native";
import { areas } from "../utils/areas";

const SelectAreaScreen = () => {
  const route = useRoute();

  const { id } = route.params;
  const { user } = useAuth();

  return (
    <View className="flex-1 bg-white px-3">
      <Text className="text-black font-bold text-xl mt-4">Select Area</Text>

      <FlatList
        data={areas}
        renderItem={({ item }) => <AreaRow value={item.name} id={id} />}
        keyExtractor={(item) => item.id}
        className="mt-4"
      />
    </View>
  );
};

export default SelectAreaScreen;
