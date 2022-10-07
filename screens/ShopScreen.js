import { View, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import ShopHeader from "../components/ShopHeader";
import ShopTitle from "../components/ShopTitle";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import ProductsList from "../components/ProductsList";
import useAuth from "../hooks/useAuth";

const ShopScreen = () => {
  const route = useRoute();
  const { url } = useAuth();
  const { ...shopDetails } = route.params;

  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res = await fetch(url + "/products/" + shopDetails.id, {
        method: "GET",
      });

      const data = await res.json();

      if (data) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getProducts();
    }, [])
  );

  // useEffect(() => {
  //   getProducts();
  // }, []);

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <ShopHeader products={products} ownerId={shopDetails.owner_id} />
      <View className="flex-1 bg-white px-3">
        <ScrollView showsVerticalScrollIndicator={false}>
          <ShopTitle shopDetails={shopDetails} products={products} />

          <View className="border-b border-gray-300"></View>

          <ProductsList products={products} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ShopScreen;
