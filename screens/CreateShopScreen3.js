import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/Header";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { launchImageLibraryAsync } from "expo-image-picker";
import useAuth from "../hooks/useAuth";
import Toast from "react-native-toast-message";
import { useTailwind } from "tailwindcss-react-native";

const CreateShop3 = () => {
  const tw = useTailwind();
  const route = useRoute();
  const navigation = useNavigation();
  const { url, user } = useAuth();
  const { shopDetails } = route.params;

  const [logo, setLogo] = useState();
  const [cover, setCover] = useState();

  const pickImage = async (setImage) => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

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
    try {
      const logoUrl = await uploadImageAsync(logo);
      const coverUrl = await uploadImageAsync(cover);

      const res = await fetch(url + "/createShop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...shopDetails,
          owner: user.id,
          logo: logoUrl,
          cover: coverUrl,
          status: "pending",
        }),
      });

      const data = await res.json();

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

      <View className="flex-1 bg-white px-3">
        <ScrollView>
          <Text className="font-semibold text-2xl mt-4">Last step!</Text>

          <View className="flex flex-row mt-4 items-center">
            <View className="flex-1">
              <Text className="font-semibold text-lg">Logo</Text>
              <TouchableOpacity onPress={() => pickImage(setLogo)}>
                <Text className="text-blue-500 font-semibold text-lg mt-2">
                  Select Image
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-gray-400 rounded rounded-full h-24 w-24"
              onPress={() => pickImage(setLogo)}
            >
              {logo && (
                <Image
                  source={{ uri: logo }}
                  className="h-full w-full rounded rounded-full"
                />
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-6">
            <Text className="font-semibold text-lg">Cover Photo</Text>

            <View className="justify-center items-center px-3">
              <TouchableOpacity
                className="bg-gray-400 rounded rounded-xl h-40 w-full mt-2"
                onPress={() => pickImage(setCover)}
              >
                {cover && (
                  <Image
                    source={{ uri: cover }}
                    className="h-full w-full rounded rounded-xl"
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => pickImage(setCover)}>
                <Text className="text-blue-500 font-semibold text-lg mt-2">
                  Select Image
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={save}
            className="bg-blue-500 items-center justify-center p-3 rounded-lg my-6"
          >
            <Text className="text-white font-semibold text-lg">
              Create Shop
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreateShop3;
