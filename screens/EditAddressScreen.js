import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import Toast from "react-native-toast-message";

import MapView, { Marker } from "react-native-maps";
import { TrashIcon } from "react-native-heroicons/outline";
import { useTailwind } from "tailwindcss-react-native";

const EditAddressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const tw = useTailwind();
  const { id } = route.params;
  const { url, getUser, setUser } = useAuth();
  let user = getUser();

  const [addressName, setAddressName] = useState(user.address[id].name);
  const [area, setArea] = useState(user.address[id].area);
  const [road, setRoad] = useState(user.address[id].road);
  const [block, setBlock] = useState(user.address[id].block);
  const [building, setBuilding] = useState(user.address[id].building);
  const [flat, setFlat] = useState(user.address[id].flat || "");
  const [region, setRegion] = useState({
    latitude: user.address[id].latitude || 10,
    longitude: user.address[id].longitude || 10,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });
  const [location, setLocation] = useState({});

  const updateAddress = async () => {
    try {
      const res = await fetch(url + "/updateAddress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addressName,
          area,
          road,
          block,
          building,
          flat,
          location,
          index: id,
        }),
      });

      const data = await res.json();

      if (data) {
        Toast.show({
          type: "success",
          text1: "Address Updated",
          text2: "You have successfully updated your address!",
          visibilityTime: 3000,
          topOffset: 50,
        });

        navigation.navigate("Account");
        setUser(data);
      } else {
        Toast.show({
          type: "error",
          text1: "Update failed",
          text2:
            "There was an error while updating your address. Please check your details and try again.",
          visibilityTime: 4000,
          topOffset: 50,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAddress = async () => {
    try {
      const res = await fetch(url + "/deleteAddress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
        }),
      });

      const data = await res.json();

      if (data) {
        Toast.show({
          type: "success",
          text1: "Address Deleted",
          text2: "You have successfully deleted your address!",
          visibilityTime: 3000,
          topOffset: 50,
        });

        navigation.navigate("Account");
        setUser(data);
      } else {
        Toast.show({
          type: "error",
          text1: "Delete failed",
          text2: "There was an error while deleteing your address.",
          visibilityTime: 4000,
          topOffset: 50,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const showAlert = () => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return false;
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: deleteAddress,
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    const willFocusSubscription = navigation.addListener("focus", () => {
      user = getUser();
      setArea(user.address[id].area);
    });

    return willFocusSubscription;
  }, []);

  return (
    <View className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className="flex-1 bg-white px-3 mt-4">
          <TouchableOpacity
            onPress={showAlert}
            className="rounded rounded-full bg-red-500 absolute top-0 right-5 p-2 z-30"
          >
            <TrashIcon color="#ffffff" />
          </TouchableOpacity>

          <Text className="text-xl font-bold">Edit Address</Text>

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

            <View className="flex flex-row mt-3">
              <Text className="text-lg font-semibold">Area</Text>
              <View className=" flex-row items-center border-b border-gray-400 ml-4">
                <Text className="text-lg">{area}</Text>
                <TouchableOpacity
                  className="ml-4"
                  onPress={() =>
                    navigation.navigate("SelectArea", {
                      id,
                    })
                  }
                >
                  <Text className="text-blue-500 text-lg font-semibold">
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex flex-row mt-3">
              <View className="flex flex-row">
                <Text className="text-lg font-semibold">Block</Text>
                <TextInput
                  value={block.toString()}
                  onChangeText={(text) => setBlock(text)}
                  className="flex-wrap ml-3 text-lg text-gray-700 border-b border-gray-400 w-11"
                  maxLength={4}
                  keyboardType="number-pad"
                />
              </View>

              <View className="flex flex-row ml-5">
                <Text className="text-lg font-semibold">Road</Text>
                <TextInput
                  value={road.toString()}
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
                  value={building.toString()}
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
                value={flat.toString()}
                onChangeText={(text) => setFlat(text)}
                className="flex-wrap ml-3 text-lg text-gray-700 border-b border-gray-400 w-14"
                maxLength={5}
                keyboardType="number-pad"
              />
            </View>

            <View className="h-1/2 mt-4">
              <MapView
                style={tw("flex-1")}
                initialRegion={region}
                showsBuildings
              >
                <Marker coordinate={region} />
              </MapView>
            </View>

            <View className="px-5 mt-4">
              <TouchableOpacity
                className="bg-blue-500 py-2 rounded-lg"
                onPress={updateAddress}
              >
                <Text className="text-xl font-semibold text-white text-center">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default EditAddressScreen;
