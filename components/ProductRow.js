import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { StarIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";
import { PencilIcon } from "react-native-heroicons/outline";
import useAuth from "../hooks/useAuth";

const ProductRow = ({ product, owner }) => {
  const navigation = useNavigation();
  const tw = useTailwind();
  const { user } = useAuth();

  const [fixedPrice, setFixedPrice] = useState(true);

  useEffect(() => {
    if (product.sizes.length > 1) {
      const basePrice = product.sizes[0].price;
      product.sizes.map((size) => {
        if (size.price !== basePrice) setFixedPrice(false);
      });
    }
  }, []);

  return (
    <TouchableOpacity
      className="flex flex-row mb-3 mx-3 border border-[#e0dcdc] rounded-lg"
      activeOpacity={1}
      onPress={() => {
        navigation.navigate("Product", {
          product,
          fixedPrice,
        });
      }}
    >
      <View className="h-36 w-40 rounded-lg p-3">
        <Image
          source={{ uri: product.photo }}
          style={[{ width: "100%", height: "100%" }, tw("rounded-lg")]}
          resizeMode="contain"
        />
      </View>

      <View className="flex-1 py-3 pl-3 pr-1 rounded-lg">
        <Text className="text-lg font-bold">{product.name}</Text>
        {fixedPrice ? (
          <Text>{product.sizes[0].price} BD</Text>
        ) : (
          <Text>Price not fixed</Text>
        )}
      </View>

      {owner === user.id && (
        <View className="p-3">
          <TouchableOpacity className="bg-gray-200 rounded rounded-full p-2">
            <PencilIcon size={25} style={tw("text-black")} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ProductRow;
