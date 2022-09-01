import { View, Text, TextInput, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import Toast from "react-native-toast-message";
import Map from "../components/Map";
import { areas } from "../utils/areas";

const CreateAddressScreen = () => {
  const navigation = useNavigation();

  const { url, setUser } = useAuth();

  const [addressName, setAddressName] = useState("");
  const [area, setArea] = useState("");
  const [road, setRoad] = useState("");
  const [block, setBlock] = useState("");
  const [building, setBuilding] = useState("");
  const [flat, setFlat] = useState(null);

  const [location, setLocation] = useState({});

  const valid =
    addressName !== "" &&
    area !== "" &&
    block !== "" &&
    road !== "" &&
    building !== "";

  const addAddress = async () => {
    try {
      const res = await fetch(url + "/addAddress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addressName,
          area,
          road,
          block,
          building,
          flat,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      const data = await res.json();

      if (data !== false) {
        Toast.show({
          type: "success",
          text1: "Address Created",
          text2: "You have successfully created a new address!",
          visibilityTime: 3000,
          topOffset: 50,
        });

        setUser(data);

        navigation.navigate("Account");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            "There was an error while creating your address. Please check your details and try again.",
          visibilityTime: 4000,
          topOffset: 50,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 bg-white px-3 mt-4">
        <ScrollView>
          <Text className="text-xl font-bold">New Address</Text>
          <View className="flex-1 mt-4">
            <View className="flex flex-row">
              <Text className="text-lg font-semibold">Address Name</Text>
              <TextInput
                value={addressName}
                onChangeText={(text) => setAddressName(text)}
                placeholder="Ex. My home"
                className="flex-1 flex-wrap ml-3 text-lg text-gray-700 border-b border-gray-400"
              />
            </View>

            <View className="mt-3">
              <Text className="text-lg font-semibold">Area</Text>
              <View className="border border-gray-200 mt-2">
                {/*<Picker*/}
                {/*  selectedValue={area}*/}
                {/*  onValueChange={(area, itemIndex) => setArea(area)}*/}
                {/*>*/}
                {/*  <Picker.Item label="Select Area" value="" />*/}
                {/*  {areas.map((area, i) => (*/}
                {/*    <Picker.Item*/}
                {/*      key={i}*/}
                {/*      label={area.label}*/}
                {/*      value={area.value}*/}
                {/*    />*/}
                {/*  ))}*/}
                {/*</Picker>*/}
              </View>
            </View>

            <View className="flex flex-row mt-6">
              <View className="flex flex-row">
                <Text className="text-lg font-semibold">Block</Text>
                <TextInput
                  value={block}
                  onChangeText={(text) => setBlock(text)}
                  className="flex-wrap ml-3 text-lg text-gray-700 border-b border-gray-400 w-11"
                  maxLength={4}
                  keyboardType="number-pad"
                />
              </View>

              <View className="flex flex-row ml-6">
                <Text className="text-lg font-semibold">Road</Text>
                <TextInput
                  value={road}
                  onChangeText={(text) => setRoad(text)}
                  className="flex-wrap ml-3 text-lg text-gray-700 border-b border-gray-400 w-14"
                  maxLength={5}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View className="flex flex-row mt-3">
              <View className="flex flex-row">
                <Text className="text-lg font-semibold">Building/House</Text>
                <TextInput
                  value={building}
                  onChangeText={(text) => setBuilding(text)}
                  className="flex-wrap ml-3 text-lg text-gray-700 border-b border-gray-400 w-16"
                  maxLength={6}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View className="flex flex-row mt-3">
              <Text className="text-lg font-semibold">
                Flat {"("}Optional{")"}
              </Text>
              <TextInput
                value={flat}
                onChangeText={(text) => setFlat(text)}
                className="flex-wrap ml-3 text-lg text-gray-700 border-b border-gray-400 w-14"
                maxLength={5}
                keyboardType="number-pad"
              />
            </View>

            <View className="h-96 mt-3">
              <Text className="text-lg font-semibold mb-3">Location</Text>
              <Map
                longitude={50.5646}
                latitude={26.20398}
                setLocation={setLocation}
                valid={valid}
                addAddress={addAddress}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default CreateAddressScreen;
