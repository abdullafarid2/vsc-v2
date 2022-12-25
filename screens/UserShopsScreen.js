import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import ShopRow from "../components/ShopRow";
import { PlusCircleIcon } from "react-native-heroicons/outline";
import useShops from "../hooks/useShops";
import { useTailwind } from "tailwindcss-react-native";
import { Badge } from "react-native-paper";
import useOrders from "../hooks/useOrders";

const UserShopsScreen = () => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const { userShops } = useShops();
  const {
    pendingOrders,
    getPendingOrders,
    getOngoingOrders,
    getDeliveredOrders,
    getCancelledOrders,
  } = useOrders();

  useFocusEffect(
    useCallback(() => {
      getPendingOrders();
      getOngoingOrders();
      getDeliveredOrders();
      getCancelledOrders();
    }, [])
  );

  return (
    <SafeAreaView className={"flex-1 bg-white"}>
      <StatusBar />

      <View className={"flex-1 px-3 pt-8 bg-white"}>
        <FlatList
          ListHeaderComponent={
            <>
              <View className={"flex-row items-center justify-between"}>
                <View className={"flex-row items-center"}>
                  <Text className={"font-bold text-black text-xl"}>
                    My shops{" "}
                  </Text>
                  <Text>({userShops.length}/5)</Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Orders")}
                    className={
                      "flex-row items-center bg-blue-500 p-2 rounded rounded-lg"
                    }
                    activeOpacity={0.8}
                  >
                    <Text className={"text-white font-medium mr-3"}>
                      Orders
                    </Text>
                    <Badge size={25} style={tw("bg-red-500 font-semibold")}>
                      {pendingOrders.length}
                    </Badge>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          }
          ListHeaderComponentStyle={tw("z-20 mb-5")}
          data={userShops}
          renderItem={({ item }) => <ShopRow shopDetails={item} />}
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            <>
              {userShops.length < 5 && (
                <TouchableOpacity
                  className={"justify-center items-center mb-4"}
                  onPress={() => navigation.navigate("CreateShop")}
                >
                  <PlusCircleIcon size={30} style={tw("text-black")} />
                  <Text>Create New Shop</Text>
                </TouchableOpacity>
              )}
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default UserShopsScreen;
