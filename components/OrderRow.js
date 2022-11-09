import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import useShops from "../hooks/useShops";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { useTailwind } from "tailwindcss-react-native";
import { useNavigation } from "@react-navigation/native";

const OrderRow = ({ order }) => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const { shops } = useShops();

  const [shop, setShop] = useState({});
  const [statusColor, setStatusColor] = useState("#fff");

  const date = new Date(order.timestamp);

  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const dateFormat = date.toDateString() + ", " + hours + ":" + minutes;

  useEffect(() => {
    setShop(shops.filter((s) => s.id === order.sid)[0]);

    if (order.status === "Pending") setStatusColor("#FD841F");
    else if (order.status === "Ongoing") setStatusColor("#FFB200");
    else if (order.status === "Cancelled") setStatusColor("#CF0A0A");
    else if (order.status === "Delivered") setStatusColor("#367E18");
  }, []);
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("OrderDetails", {
          order,
          dateFormat,
          statusColor,
        })
      }
      className="flex-row justify-between my-2"
    >
      <View className="border border-gray-300 rounded rounded-xl h-20 w-24 p-1">
        <Image
          source={{ uri: shop.logo }}
          className="h-full w-full rounded rounded-xl"
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 ml-6">
        <Text className="text-lg font-semibold mb-0.5">{shop.name}</Text>
        <Text style={{ color: statusColor }} className="font-medium mb-0.5">
          {order.status}
        </Text>
        <Text className="mb-0.5 text-gray-500">{dateFormat}</Text>
        <Text className="text-gray-500">Order ID: {order.id}</Text>
      </View>
      <View className={"justify-center"}>
        <ChevronRightIcon size={25} style={tw("text-gray-600")} />
      </View>
    </TouchableOpacity>
  );
};

export default OrderRow;
