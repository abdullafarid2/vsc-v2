import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AdjustmentsVerticalIcon } from "react-native-heroicons/outline";
import ProductCard from "./ProductCard";
import { useTailwind } from "tailwindcss-react-native";

const ProductsList = ({ products }) => {
  const tw = useTailwind();

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

      <Text className="text-gray-500 font-semibold mt-1 mb-5">
        {products.length} Products
      </Text>

      <View className="px-3 items-center">
        <View className="flex flex-row flex-wrap">
          {products.length > 0 &&
            products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
        </View>
      </View>
    </View>
  );
};

export default ProductsList;
