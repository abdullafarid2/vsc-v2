import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import ShopRow from "../components/ShopRow";
import { BeakerIcon, FunnelIcon } from "react-native-heroicons/solid";
import useShops from "../hooks/useShops";
import { useTailwind } from "tailwindcss-react-native";

const CategoryScreen = () => {
  const route = useRoute();
  const tw = useTailwind();
  const navigation = useNavigation();

  const { category } = route.params;
  const { shops } = useShops();

  const [filteredShops, setFilteredShops] = useState([]);

  const getShopsWithCategory = () => {
    const filter = shops.filter((shop) => shop.category === category.id);

    setFilteredShops(filter);
  };

  useEffect(() => {
    getShopsWithCategory();
  }, []);

  return (
    <View className="flex-1 px-3 pt-2 bg-white">
      <FlatList
        ListHeaderComponent={
          <>
            <View className="flex-row items-center justify-center">
              <View className="h-40 w-40">
                <Image
                  source={{ uri: category.imageurl }}
                  style={{ width: "90%", height: "90%" }}
                />
              </View>
            </View>

            <View className="flex-row mb-3 -mt-2">
              <Text className="self-center font-semibold text-lg">
                Browse your favorite in "{category.name}"
              </Text>
              <View className="flex-1 items-end mr-2">
                <TouchableOpacity>
                  <FunnelIcon style={tw("text-black")} size={30} />
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        data={filteredShops}
        renderItem={({ item }) => <ShopRow shopDetails={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default CategoryScreen;
