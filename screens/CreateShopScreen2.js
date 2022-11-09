import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput as RNTextInput,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { areas } from "../utils/areas";
import MapView, { Marker } from "react-native-maps";
import { useTailwind } from "tailwindcss-react-native";
import { CheckIcon } from "react-native-heroicons/outline";
import SelectListModal from "../components/SelectListModal";
import {
  ActivityIndicator,
  TextInput as TextInputPaper,
  MD3Colors,
  MD2Colors,
} from "react-native-paper";
import { verifyPhoneNumber } from "../utils/formValidation";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Toast from "react-native-toast-message";
import useAuth from "../hooks/useAuth";

const CreateShop2 = () => {
  const tw = useTailwind();
  const route = useRoute();
  const navigation = useNavigation();

  const { user, url } = useAuth();

  const { shopDetails } = route.params;

  const [road, setRoad] = useState("");
  const [block, setBlock] = useState("");
  const [building, setBuilding] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState({});
  const [region, setRegion] = useState({
    latitude: 26.20398,
    longitude: 50.5646,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const valid = road !== "" && block !== "" && building !== "" && area !== "";

  const uploadImageAsync = async (uri) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const file = uri.substring(uri.lastIndexOf("/") + 1);

    const fileRef = ref(getStorage(), file);
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  };

  const save = async () => {
    setLoading(true);
    try {
      const logoUrl = await uploadImageAsync(shopDetails.logo);

      const res = await fetch(url + "/createShop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area,
          block,
          building,
          road,
          latitude: location.latitude,
          longitude: location.longitude,
          ...shopDetails,
          owner: user.id,
          logo: logoUrl,
          status: "pending",
        }),
      });

      const data = await res.json();

      setLoading(false);

      data
        ? navigation.navigate("ShopCreatedSuccess")
        : Toast.show({
            type: "error",
            text1: "Error",
            text2:
              "There was an error while creating your shop. Please check your details and try again.",
            visibilityTime: 4000,
            topOffset: 50,
          });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <Header />

      <View className="flex-1 bg-white px-3 pt-4">
        <SelectListModal
          title="Area"
          selected={area}
          data={areas}
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          setSelect={setArea}
        />

        <ScrollView>
          <Text className="text-black font-semibold text-2xl">
            Almost done!
          </Text>

          <View className="mt-4">
            <TextInputPaper
              label="Road"
              underlineColor="#0099F9"
              activeUnderlineColor="#0099F9"
              className="bg-white mb-4"
              value={road}
              onChangeText={(text) => setRoad(text)}
              render={(props) => (
                <RNTextInput {...props} keyboardType="numeric" />
              )}
            />
          </View>

          <View className="mt-4">
            <TextInputPaper
              label="Block"
              underlineColor="#0099F9"
              activeUnderlineColor="#0099F9"
              className="bg-white mb-4"
              value={block}
              onChangeText={(text) => setBlock(text)}
              render={(props) => (
                <RNTextInput {...props} keyboardType="numeric" />
              )}
            />
          </View>

          <View className="mt-4">
            <TextInputPaper
              label="Building/House/Store No."
              underlineColor="#0099F9"
              activeUnderlineColor="#0099F9"
              className="bg-white mb-4"
              value={building}
              onChangeText={(text) => setBuilding(text)}
              render={(props) => (
                <RNTextInput {...props} keyboardType="numeric" />
              )}
            />
          </View>

          <View className="mt-6">
            <Text className="text-lg font-semibold">Area</Text>
            <View className="flex flex-row mt-2 border-b border-gray-400">
              <Text className="flex-1 ">{area || "No area selected"}</Text>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Text className="text-blue-500 text-lg font-semibold">
                  Select
                </Text>
              </TouchableOpacity>
            </View>
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

          {loading ? (
            <TouchableOpacity className="bg-blue-500 items-center justify-center p-3 rounded-lg my-6">
              <ActivityIndicator animating={loading} color={MD2Colors.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-blue-500 items-center justify-center p-3 rounded-lg my-6"
              onPress={() => save()}
              disabled={!valid}
            >
              <Text className="text-white font-semibold text-lg">
                Create Shop
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreateShop2;
