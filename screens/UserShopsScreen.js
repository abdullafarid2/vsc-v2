import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { StatusBar } from "expo-status-bar";
import ShopRow from "../components/ShopRow";
import { PlusCircleIcon } from "react-native-heroicons/outline";
import useShops from "../hooks/useShops";
import { useTailwind } from "tailwindcss-react-native";

const UserShopsScreen = () => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const { url, user } = useAuth();
  const { shops } = useShops();

  const [userShops, setUserShops] = useState([]);

  const getUserShops = async () => {
    setUserShops(shops.filter((shop) => shop.owner_id === user.id));
  };

  useEffect(() => {
    getUserShops();
  }, []);

  useEffect(() => {
    const willFocusSubscription = navigation.addListener("focus", () => {
      getUserShops();
    });
  }, [shops]);
  return (
    <SafeAreaView className={"flex-1 bg-white"}>
      <StatusBar />

      <View className={"flex-1 px-3 pt-8 bg-white"}>
        <FlatList
          ListHeaderComponent={
            <>
              <View className={"flex-row items-center"}>
                <Text className={"font-bold text-black text-xl"}>
                  My shops{" "}
                </Text>
                <Text>({userShops.length}/5)</Text>
              </View>
            </>
          }
          ListHeaderComponentStyle={tw("z-20 mb-5")}
          data={userShops}
          renderItem={({ item }) => <ShopRow shopDetails={item} />}
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            <TouchableOpacity
              className={"justify-center items-center mb-4"}
              onPress={() => navigation.navigate("CreateShop")}
            >
              <PlusCircleIcon size={30} style={tw("text-black")} />
              <Text>Create New Shop</Text>
            </TouchableOpacity>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default UserShopsScreen;
