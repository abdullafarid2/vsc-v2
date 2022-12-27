import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import ShopRow from "../components/ShopRow";
import { BeakerIcon, FunnelIcon } from "react-native-heroicons/solid";
import useShops from "../hooks/useShops";
import { useTailwind } from "tailwindcss-react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const CategoryScreen = () => {
  const route = useRoute();
  const tw = useTailwind();
  const navigation = useNavigation();

  const { category } = route.params;
  const { shops } = useShops();

  const [filteredShops, setFilteredShops] = useState([]);

  const getShopsWithCategory = () => {
    const filter = shops.filter(
      (shop) =>
        shop.category === category.id &&
        shop.status !== "pending" &&
        shop.status !== "deleted"
    );

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
            <View className={`items-center justify-center`}>
              <View
                className={`bg-[#${category.color}] rounded-full p-3 rounded-full`}
              >
                <Icon name={category.icon} size={40} color={"#000000"} />
              </View>
              <Text className={"text-lg font-medium mt-1 mb-3"}>
                {category.name}
              </Text>
            </View>
          </>
        }
        data={filteredShops}
        renderItem={({ item }) => <ShopRow shopDetails={item} />}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <>{filteredShops.length === 0 && <Text>No shops found.</Text>}</>
        }
      />
    </View>
  );
};

export default CategoryScreen;
