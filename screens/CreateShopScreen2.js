import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { areas } from "../utils/areas";
import MapView, { Marker } from "react-native-maps";
import { useTailwind } from "tailwindcss-react-native";

const CreateShop2 = () => {
  const tw = useTailwind();
  const route = useRoute();
  const navigation = useNavigation();

  const { shopDetails } = route.params;

  const [road, setRoad] = useState();
  const [block, setBlock] = useState();
  const [building, setBuilding] = useState();
  const [area, setArea] = useState();
  const [location, setLocation] = useState({});
  const [region, setRegion] = useState({
    latitude: 26.20398,
    longitude: 50.5646,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <Header />

      <View className="flex-1 bg-white px-3 pt-4">
        <ScrollView>
          <Text className="text-black font-semibold text-2xl">
            Almost done!
          </Text>

          <Text className="text-xl font-semibold mt-6">Address</Text>

          <View className="flex flex-row mt-3">
            <View className="flex flex-row">
              <Text className="text-lg font-semibold mt-3">Road</Text>
              <TextInput
                value={road}
                onChangeText={(text) => setRoad(text)}
                className="flex-wrap ml-3 text-lg text-gray-700 border-b border-gray-400 w-20 h-9"
                maxLength={5}
                keyboardType="number-pad"
              />
            </View>
            <View className="flex flex-row  ml-6">
              <Text className="text-lg font-semibold mt-3">Block</Text>
              <TextInput
                value={block}
                onChangeText={(text) => setBlock(text)}
                className="flex-wrap ml-3 text-lg text-gray-700 border-b border-gray-400 w-20 h-9"
                maxLength={4}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View className="flex flex-row mt-5">
            <View className="flex flex-row">
              <Text className="text-lg font-semibold mt-3">
                Building/House/Store No.
              </Text>
              <TextInput
                value={building}
                onChangeText={(text) => setBuilding(text)}
                className="flex-wrap ml-3 text-lg text-gray-700 border-b border-gray-400 w-20 h-9"
                maxLength={6}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-lg font-semibold">Area</Text>
            {/*<Picker*/}
            {/*  selectedValue={area}*/}
            {/*  onValueChange={(area) => setArea(area)}*/}
            {/*  className="border rounded-lg border-gray-400 mt-2"*/}
            {/*>*/}
            {/*  <Picker.Item label="" value="" />*/}
            {/*  {areas.map((area, i) => (*/}
            {/*    <Picker.Item key={i} label={area.label} value={area.value} />*/}
            {/*  ))}*/}
            {/*</Picker>*/}
          </View>

          <View className="h-96 mt-10">
            <Text className="text-lg font-semibold mb-5">Location</Text>
            <MapView
              style={tw("flex-1")}
              initialRegion={region}
              onRegionChange={(region) => {
                setRegion(region);
                setLocation(region);
              }}
              showsBuildings
            >
              <Marker coordinate={region} />
            </MapView>
          </View>

          <TouchableOpacity
            className="bg-blue-500 items-center justify-center p-3 rounded-lg my-6"
            onPress={() =>
              navigation.navigate("CreateShop3", {
                shopDetails: {
                  ...shopDetails,
                  road,
                  block,
                  building,
                  area,
                  longitude: location.longitude,
                  latitude: location.latitude,
                },
              })
            }
          >
            <Text className="text-white font-semibold text-lg">Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreateShop2;
