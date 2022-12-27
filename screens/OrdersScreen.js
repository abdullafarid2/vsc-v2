import React, { useLayoutEffect, useState, useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Button, Divider, Menu } from "react-native-paper";
import { useTailwind } from "tailwindcss-react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
} from "react-native-heroicons/outline";
import useOrders from "../hooks/useOrders";
import OrderRow from "../components/OrderRow";

const Orders = () => {
  const navigation = useNavigation();
  const tw = useTailwind();

  const { pendingOrders, ongoingOrders, deliveredOrders, cancelledOrders } =
    useOrders();

  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState({
    name: "Pending",
    items: pendingOrders,
  });
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className={"flex-1 bg-white"} edges={["top"]}>
      <View className={"flex-1 bg-white px-3"}>
        <View className={"flex-row mt-3"}>
          <TouchableOpacity
            className={
              "bg-gray-300 justify-center items-center rounded-full p-2"
            }
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size={24} style={tw("text-black")} />
          </TouchableOpacity>
        </View>
        <View className={"flex-row justify-between items-center py-4"}>
          <Text className={"font-semibold text-xl"}>Orders</Text>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <View className={"p-2 border border-gray-300 rounded rounded-md"}>
                <TouchableOpacity
                  onPress={openMenu}
                  className={"flex-row items-center"}
                >
                  <Text className={"text-lg mr-2"}>{filter.name}</Text>
                  <ChevronDownIcon size={16} style={tw("text-black")} />
                </TouchableOpacity>
              </View>
            }
            contentStyle={tw("bg-white")}
          >
            <Menu.Item
              onPress={() => {
                setFilter({ name: "Pending", items: pendingOrders });
                closeMenu();
              }}
              title={"Pending"}
            />
            <Divider style={tw("bg-gray-300")} />
            <Menu.Item
              onPress={() => {
                setFilter({ name: "Ongoing", items: ongoingOrders });
                closeMenu();
              }}
              title={"Ongoing"}
            />
            <Divider style={tw("bg-gray-300")} />
            <Menu.Item
              onPress={() => {
                setFilter({ name: "Delivered", items: deliveredOrders });
                closeMenu();
              }}
              title={"Delivered"}
            />
            <Divider style={tw("bg-gray-300")} />
            <Menu.Item
              onPress={() => {
                setFilter({ name: "Cancelled", items: cancelledOrders });
                closeMenu();
              }}
              title={"Cancelled"}
            />
          </Menu>
        </View>

        <FlatList
          data={filter.items}
          renderItem={({ item }) => <OrderRow order={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default Orders;
