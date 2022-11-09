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

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <Header />

      <View className="flex-1 bg-white px-3">
        <ScrollView>
          <Text className="font-semibold text-2xl mt-4">Last step!</Text>

          <View className="flex flex-row mt-6 items-center">
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

          <View className={"mt-24"}>
            <TouchableOpacity
              onPress={save}
              className="bg-blue-500 items-center justify-center p-3 rounded-lg my-6"
            >
              <Text className="text-white font-semibold text-lg">
                Create Shop
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreateShop3;
