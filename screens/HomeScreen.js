import { Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import HomeHeader from "../components/HomeHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import ShopList from "../components/ShopList";
import useAuth from "../hooks/useAuth";

const HomeScreen = () => {
  const shuffle = (shopsArray) => {
    // setShops(shopsArray.filter((shop) => shop.owner_id !== user.id));

    for (let i = shopsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shopsArray[i], shopsArray[j]] = [shopsArray[j], shopsArray[i]];
    }

    if (shopsArray.length > 0 && shopsArray.length >= 5) {
      shopsArray.length = 5;
    }
  };

  const [shops, setShops] = useState([]);

  shuffle(shops);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-blue-500" edges={["top"]}>
      <HomeHeader />

      <View className="flex-1 bg-white">
        <ShopList shops={shops} setShops={setShops} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
