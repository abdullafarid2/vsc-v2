import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

import { StarIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";

const Shop = ({ shopDetails }) => {
  const tw = useTailwind();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className="flex flex-row mb-3 mx-3 border border-[#e0dcdc] rounded-lg"
      activeOpacity={1}
      onPress={() => {
        navigation.navigate("Shop", {
          ...shopDetails,
        });
      }}
    >
      <View className="h-36 w-40 rounded-lg p-3">
        <Image
          source={{ uri: shopDetails.logo }}
          style={[{ width: "100%", height: "100%" }, tw("rounded-lg")]}
          resizeMode="contain"
        />
      </View>

      <View className="flex-1 py-3 pl-3 pr-1 rounded-lg">
        <Text className="text-lg font-bold">{shopDetails.name}</Text>
        <Text className="text-[#838383] font-semibold">
          {shopDetails.subcategories.join(", ")}
        </Text>
        <View className="flex-row mt-1">
          {shopDetails.rating &&
            shopDetails.rating > 0 &&
            Array(Math.round(shopDetails.rating))
              .fill()
              .map((_, i) => (
                <StarIcon
                  key={i}
                  color={"#FFC700"}
                  style={tw("-ml-1")}
                  size={20}
                />
              ))}

          {shopDetails.rating ? (
            <Text className="text-[#838383] font-semibold">
              ({Math.round(shopDetails.rating)})
            </Text>
          ) : (
            <Text className="text-[#838383]">No rating available</Text>
          )}
        </View>

        <View className="flex flex-row mt-1">
          {Array(shopDetails.price_range)
            .fill()
            .map((_, i) => (
              <Text key={i} className="text-green-700 font-bold">
                $
              </Text>
            ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Shop;
