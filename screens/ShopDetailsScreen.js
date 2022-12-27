import React, { useLayoutEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { useTailwind } from "tailwindcss-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";

const ShopDetails = () => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const route = useRoute();
  const { ...shopDetails } = route.params;

  const [region, setRegion] = useState({
    latitude: shopDetails?.address?.latitude,
    longitude: shopDetails?.address?.longitude,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Shop Details",
      headerStyle: {
        backgroundColor: "#0584F9",
      },
      headerTintColor: "#fff",
    });
  });
  return (
    <View className={"flex-1 bg-white"}>
      <View className={"h-1/2 p-3"}>
        <ScrollView>
          <View className={"flex-row items-center"}>
            <View className={"h-28 w-28 rounded-full"}>
              <Image
                source={{ uri: shopDetails?.logo }}
                className={"h-full w-full rounded-full"}
              />
            </View>
            <Text className={"ml-4 text-2xl font-semibold"}>
              {shopDetails?.name}
            </Text>
          </View>

          <View className={"pb-1 mt-8 flex-row items-center"}>
            <Text className={"text-lg font-bold"}>Email</Text>
            <View className={"flex-1 border-b border-gray-200"}>
              <Text className={"ml-2  text-lg"}>{shopDetails?.email}</Text>
            </View>
          </View>

          <View className={"pb-1 mt-3 flex-row items-center"}>
            <Text className={"text-lg font-bold"}>Phone</Text>
            <View className={"flex-1 border-b border-gray-200"}>
              <Text className={"ml-2  text-lg"}>{shopDetails?.phone}</Text>
            </View>
          </View>

          <View className={"pb-1 mt-3"}>
            <Text className={"text-lg font-bold"}>Description</Text>
            <View className={"flex-1 border-gray-200"}>
              <Text className={"text-lg"}>{shopDetails?.description}</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View className={"h-1/2"}>
        <View className={"flex-1 bg-white"}>
          <MapView style={tw("flex-1")} initialRegion={region} showsBuildings>
            {shopDetails?.address?.longitude &&
              shopDetails?.address?.latitude && <Marker coordinate={region} />}
          </MapView>
        </View>
      </View>
    </View>
  );
};

export default ShopDetails;
