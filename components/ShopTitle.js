import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { StarIcon } from "react-native-heroicons/solid";
import { useTailwind } from "tailwindcss-react-native";

const ShopTitle = ({ logo, shopName, subcategories, rating }) => {
  const tw = useTailwind();
  return (
    <View className="flex flex-row my-3">
      <Image
        source={{ uri: logo }}
        className="rounded rounded-full h-24 w-24"
        resizeMode="contain"
      />

      <View className="flex-1 ml-3">
        <Text className="text-lg font-bold">{shopName}</Text>

        <Text className="text-gray-500 font-semibold mt-1">
          {subcategories.join(", ")}
        </Text>

        <View className="flex-row mt-1 items-center">
          {rating &&
            rating > 0 &&
            Array(Math.round(rating))
              .fill()
              .map((_, i) => (
                <StarIcon
                  key={i}
                  color={"#FFC700"}
                  style={tw(`-ml-1`)}
                  size={30}
                />
              ))}

          {rating ? (
            <Text className="text-[#838383] font-semibold">
              ({Math.round(rating)})
            </Text>
          ) : (
            <Text className="text-[#838383]">No rating available</Text>
          )}
        </View>

        <TouchableOpacity>
          <Text className="text-blue-500 font-bold mt-1">More Info</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-2">
        <TouchableOpacity>
          <Text className="text-blue-500 font-bold mt-1">Send Message</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-5">
          <Text className="text-blue-500 font-bold mt-1">Reviews</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShopTitle;
