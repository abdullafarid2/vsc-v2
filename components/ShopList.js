import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import CategoriesSlider from "./CategoriesSlider";
import ShopRow from "./ShopRow";
import useAuth from "../hooks/useAuth";
import { useTailwind } from "tailwindcss-react-native";

const ShopList = ({ shops, setShops }) => {
  const tw = useTailwind();
  const { url } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    fetchShops().then(() => wait(1000).then(() => setRefreshing(false)));
  });

  const fetchShops = async () => {
    try {
      const res = await fetch(url + "/shops", {
        method: "GET",
      });

      const data = await res.json();

      if (data) {
        setShops(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <FlatList
      ListHeaderComponent={
        <>
          {/* Categories List */}
          <Text className="text-2xl font-bold text-black mt-6 ml-3">
            Browse Categories
          </Text>

          <CategoriesSlider />

          {/* Shops List */}
          <View className="flex-row justify-between mt-8 mb-8 px-3">
            <Text className="text-2xl text-black font-bold">Browse Shops</Text>

            <TouchableOpacity className="flex-row items-end mr-2">
              <Text className="font-semibold text-blue-600 text-lg">
                View all
              </Text>
            </TouchableOpacity>
          </View>
        </>
      }
      ListHeaderComponentStyle={tw("z-20")}
      data={shops}
      renderItem={({ item }) => <ShopRow shopDetails={item} />}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          style={tw("absolute z-40")}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
  );
};

export default ShopList;
