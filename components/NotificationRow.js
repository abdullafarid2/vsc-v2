import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import useShops from "../hooks/useShops";

const NotificationRow = ({ notification }) => {
  const { shops } = useShops();

  const [shop, setShop] = useState({});

  const date = new Date(notification.timestamp);
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const dateFormat = date.toDateString() + ", " + hours + ":" + minutes;

  useEffect(() => {
    setShop(shops.filter((s) => s.id === notification.shopId)[0]);
  }, []);

  return (
    <View className="flex-row items-center justify-between my-3">
      <View className="border border-gray-300 rounded rounded-xl p-1 bg-white self-start">
        <Image
          source={{ uri: shop.logo }}
          className="h-16 w-20 rounded rounded-xl"
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 ml-3">
        <Text className="font-medium text-lg">{shop.name}</Text>
        <Text className="text-gray-700 mb-1">{notification.message}</Text>
        <Text className="text-gray-400">{dateFormat}</Text>
      </View>
      {!notification.read && (
        <View className="h-5 w-5 rounded rounded-full bg-blue-500"></View>
      )}
    </View>
  );
};

export default NotificationRow;
