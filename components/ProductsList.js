import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AdjustmentsVerticalIcon } from "react-native-heroicons/outline";
import ProductCard from "./ProductCard";
import { useTailwind } from "tailwindcss-react-native";

const ProductsList = () => {
  const tw = useTailwind();
  const arr = [1, 2, 3, 4];
  return (
    <View className="mt-3">
      <View className="flex flex-row">
        <View className="flex-1">
          <Text className="text-xl font-semibold">All Items</Text>
        </View>

        <TouchableOpacity className="flex flex-row items-center">
          <AdjustmentsVerticalIcon size={25} style={tw("text-black")} />
          <Text className="ml-1 text-lg">Filter</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-gray-500 font-semibold mt-1 mb-5">20 products</Text>

      <View className="flex flex-row grid grid-cols-2 gap-2 space-x-3">
        {arr.map((val, i) => (
          <ProductCard key={i} />
        ))}
      </View>
    </View>
  );
};

export default ProductsList;
