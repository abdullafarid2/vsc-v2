import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const ProductCard = () => {
  return (
    <View className="w-1/2">
      <TouchableOpacity activeOpacity={1}>
        <Image
          source={{
            uri: "https://m.media-amazon.com/images/I/61M9K0JF8bL._AC_SX569._SX._UX._SY._UY_.jpg",
          }}
          className="h-40 w-full"
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View className="ml-4">
        <Text className="font-bold text-lg mt-2">Shirt</Text>
        <Text className="font-bold text-lg mt-1">2.000 BD</Text>
      </View>
    </View>
  );
};

export default ProductCard;
