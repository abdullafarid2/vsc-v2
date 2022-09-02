import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

const CreateShop = () => {
  const navigation = useNavigation();
  const { url } = useAuth();

  const [shopName, setShopName] = useState("");
  const [cr, setCr] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const res = await fetch(url + "/categories", {
        method: "GET",
      });

      const data = await res.json();

      if (data) setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <Header />
      <View className="flex-1 px-3 bg-white pt-3">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView>
            <Text className="text-black font-semibold text-2xl">
              Create your own Shop!
            </Text>

            <View className="mt-6">
              <Text className="text-lg font-semibold">Shop Name</Text>
              <TextInput
                value={shopName}
                onChangeText={(text) => setShopName(text)}
                className="flex-1 border-b h-9 border-gray-400"
                placeholder="Shop Name"
              />
            </View>

            <View className="mt-6">
              <Text className="text-lg font-semibold">
                Commercial Registration No. (CR)
              </Text>
              <TextInput
                value={cr}
                onChangeText={(text) => setCr(text)}
                className="flex-1 border-b h-9 border-gray-400"
                placeholder="CR"
              />
            </View>

            <View className="mt-6">
              <Text className="text-lg font-semibold">Email</Text>
              <Text className="font-semibold text-gray-500">
                This can be your personal email or your shop's email if
                available
              </Text>
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                className="flex-1 border-b h-9 border-gray-400"
                placeholder="Email"
              />
            </View>

            <View className="mt-6">
              <Text className="text-lg font-semibold">Phone Number</Text>
              <Text className="font-semibold text-gray-500">
                This can be your personal number or your shop's number if
                available
              </Text>
              <TextInput
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
                className="flex-1 border-b h-9 border-gray-400"
                placeholder="Phone Number"
                keyboardType="numeric"
              />
            </View>

            <View className="mt-6">
              <Text className="text-lg font-semibold">Description</Text>
              <Text className="font-semibold text-gray-500">
                Give a brief description of your shop
              </Text>
              <TextInput
                value={description}
                onChangeText={(text) => setDescription(text)}
                className="flex-1 border rounded-lg border-gray-400 p-2 mt-3 h-20"
                placeholder="Description"
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <View className="mt-6">
              <Text className="text-lg font-semibold">Category</Text>
              {/*<Picker*/}
              {/*  selectedValue={category}*/}
              {/*  onValueChange={(category) => setCategory(category)}*/}
              {/*  className="border rounded-lg border-gray-400 mt-2"*/}
              {/*>*/}
              {/*  <Picker.Item label="" value="" />*/}
              {/*  {categories.length > 0 &&*/}
              {/*    categories.map((category, i) => (*/}
              {/*      <Picker.Item*/}
              {/*        key={i}*/}
              {/*        label={category.name}*/}
              {/*        value={category.id}*/}
              {/*      />*/}
              {/*    ))}*/}
              {/*</Picker>*/}
            </View>

            <TouchableOpacity
              className="bg-blue-500 items-center justify-center p-3 rounded-lg my-6"
              onPress={() =>
                navigation.navigate("CreateShop2", {
                  shopDetails: {
                    shopName,
                    cr,
                    email,
                    phoneNumber,
                    description,
                    category,
                  },
                })
              }
            >
              <Text className="text-white font-semibold text-lg">Next</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default CreateShop;
