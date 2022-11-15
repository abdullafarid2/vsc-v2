import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import useOrders from "../hooks/useOrders";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";
import { Divider, Menu } from "react-native-paper";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import OrderRow from "../components/OrderRow";
import { SafeAreaView } from "react-native-safe-area-context";

const UserOrdersScreen = () => {
  const navigation = useNavigation();
  const tw = useTailwind();

  const {
    myPendingOrders,
    myOngoingOrders,
    myDeliveredOrders,
    myCancelledOrders,
  } = useOrders();

  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState({
    name: "Pending",
    items: myPendingOrders,
  });
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    console.log(filter.items);
  }, []);

  return (
    <SafeAreaView className={"flex-1 bg-white"} edges={["top"]}>
      <View className={"flex-1 bg-white px-3"}>
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
                setFilter({ name: "Pending", items: myPendingOrders });
                closeMenu();
              }}
              title={"Pending"}
            />
            <Divider style={tw("bg-gray-300")} />
            <Menu.Item
              onPress={() => {
                setFilter({ name: "Ongoing", items: myOngoingOrders });
                closeMenu();
              }}
              title={"Ongoing"}
            />
            <Divider style={tw("bg-gray-300")} />
            <Menu.Item
              onPress={() => {
                setFilter({ name: "Delivered", items: myDeliveredOrders });
                closeMenu();
              }}
              title={"Delivered"}
            />
            <Divider style={tw("bg-gray-300")} />
            <Menu.Item
              onPress={() => {
                setFilter({ name: "Cancelled", items: myCancelledOrders });
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

export default UserOrdersScreen;
