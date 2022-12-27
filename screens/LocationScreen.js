import React, { useLayoutEffect, useState } from "react";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { useTailwind } from "tailwindcss-react-native";

const Location = () => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const route = useRoute();
  const { address } = route.params;

  const [region, setRegion] = useState({
    latitude: address?.latitude,
    longitude: address?.longitude,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Location",
      headerStyle: {
        backgroundColor: "#0584F9",
      },
      headerTintColor: "#fff",
    });
  });
  return (
    <View className={"flex-1 bg-white"}>
      <MapView style={tw("flex-1")} initialRegion={region} showsBuildings>
        {address?.longitude && address?.latitude && (
          <Marker coordinate={region} />
        )}
      </MapView>
    </View>
  );
};

export default Location;
