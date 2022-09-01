import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useTailwind } from "tailwindcss-react-native";

const Map = ({ longitude, latitude, setLocation, valid, addAddress }) => {
  const tw = useTailwind();
  const [region, setRegion] = useState({
    latitude,
    longitude,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });
  return (
    <View className="flex-1">
      <MapView
        style={tw("flex-1")}
        initialRegion={region}
        onRegionChange={(region) => {
          setRegion(region);
          setLocation(region);
        }}
        showsBuildings
      >
        {longitude && latitude && <Marker coordinate={region} />}
      </MapView>

      <View className="mt-6 px-5 mb-8">
        <TouchableOpacity
          style={tw(`bg-blue-500 py-2 rounded-lg ${!valid && "bg-gray-400"}`)}
          disabled={!valid}
          onPress={addAddress}
        >
          <Text className="text-xl font-semibold text-white text-center">
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Map;
