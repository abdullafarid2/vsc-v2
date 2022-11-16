import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";

import { StarIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";
import { MD2Colors } from "react-native-paper";
import StarRating from "react-native-star-rating-widget";

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
        <Text className="text-[#838383] font-semibold mt-1">
          {shopDetails.category_name}
        </Text>
        <View className="flex-row mt-1">
          {shopDetails.avg ? (
            <View className={"flex-row items-center"} pointerEvents={"none"}>
              <StarRating
                rating={shopDetails.avg}
                onChange={() => {}}
                maxStars={Math.ceil(shopDetails.avg)}
                starSize={25}
                className={"self-center"}
                starStyle={{ marginHorizontal: 0 }}
              />
              <Text className={"text-gray-500"}>
                ({shopDetails.avg.toFixed(1)})
              </Text>
            </View>
          ) : (
            <Text className="text-[#838383]">No rating available</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Shop;
