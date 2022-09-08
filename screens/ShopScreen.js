import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import ShopHeader from "../components/ShopHeader";
import ShopTitle from "../components/ShopTitle";
import { useRoute } from "@react-navigation/native";
import ProductsList from "../components/ProductsList";

const ShopScreen = () => {
  const route = useRoute();
  const { ...shopDetails } = route.params;
  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <ShopHeader />
      <View className="flex-1 bg-white px-3">
        <ScrollView>
          <ShopTitle
            logo={shopDetails.logo}
            shopName={shopDetails.name}
            subcategories={shopDetails.subcategories}
            rating={shopDetails.rating}
            owner={shopDetails.owner_id}
          />

          <View className="border-b border-gray-300"></View>

          <ProductsList />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ShopScreen;
