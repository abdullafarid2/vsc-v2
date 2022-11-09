import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput as RNTextInput,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { CheckIcon } from "react-native-heroicons/outline";
import { useTailwind } from "tailwindcss-react-native";
import SelectListModal from "../components/SelectListModal";
import { TextInput as TextInputPaper } from "react-native-paper";
import {
  verifyCR,
  verifyEmail,
  verifyPhoneNumber,
  verifyShopName,
  verifyText,
} from "../utils/formValidation";
import { launchImageLibraryAsync } from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const CreateShop = () => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const { url } = useAuth();

  const [shopName, setShopName] = useState("");
  const [cr, setCr] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [logo, setLogo] = useState("");

  const [shopNameFocused, setShopNameFocused] = useState(false);
  const [crFocused, setCrFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const pickImage = async (setImage) => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const valid =
    shopName !== "" &&
    cr !== "" &&
    email !== "" &&
    phoneNumber !== "" &&
    description !== "" &&
    category !== "" &&
    logo !== "" &&
    verifyShopName(shopName) &&
    verifyCR(cr) &&
    verifyEmail(email) &&
    verifyPhoneNumber(phoneNumber) &&
    verifyText(description);

  const [modalVisible, setModalVisible] = useState(false);

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

  useEffect(() => {
    categories.length > 0 &&
      setCategoryId(categories?.filter((c) => c.name === category)[0].id);
  }, [category]);

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <Header />
      <View className="flex-1 px-3 bg-white pt-3">
        <SelectListModal
          title="Category"
          selected={category}
          data={categories}
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          setSelect={setCategory}
        />
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView>
            <Text className="text-black font-semibold text-2xl">
              Create your own Shop!
            </Text>

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

            <View className="mt-6">
              <TextInputPaper
                mode="flat"
                label="Shop Name"
                placeholder="Shop Name"
                value={shopName}
                onChangeText={(text) => setShopName(text)}
                underlineColor="#0099F9"
                activeUnderlineColor="#0099F9"
                className="bg-white mb-4 flex-1"
                onFocus={() => setShopNameFocused(true)}
                error={!verifyShopName(shopName) && shopNameFocused}
              />
              {!verifyShopName(shopName) && shopNameFocused && (
                <Text className={"text-red-700"}>
                  Please enter a valid name.
                </Text>
              )}
            </View>

            <View className="mt-6">
              <TextInputPaper
                mode="flat"
                label="Commercial Registration No. (CR)"
                placeholder="CR"
                value={cr}
                onChangeText={(text) => setCr(text)}
                underlineColor="#0099F9"
                activeUnderlineColor="#0099F9"
                className="bg-white mb-4 flex-1"
                onFocus={() => setCrFocused(true)}
                error={!verifyCR(cr) && crFocused}
              />

              {!verifyCR(cr) && crFocused && (
                <Text className={"text-red-700"}>
                  Please enter a CR (eg. 1234-1).
                </Text>
              )}
            </View>

            <View className="mt-6">
              <TextInputPaper
                mode="flat"
                label="Shop Email"
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                underlineColor="#0099F9"
                activeUnderlineColor="#0099F9"
                className="bg-white mb-4 flex-1"
                onFocus={() => setEmailFocused(true)}
                error={!verifyEmail(email) && emailFocused}
              />
              {!verifyEmail(email) && emailFocused && (
                <Text className={"text-red-700"}>
                  Please enter a valid email.
                </Text>
              )}
            </View>

            <View className="mt-6">
              <TextInputPaper
                label="Phone Number"
                underlineColor="#0099F9"
                activeUnderlineColor="#0099F9"
                className="bg-white mb-4"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
                render={(props) => (
                  <RNTextInput {...props} keyboardType="numeric" />
                )}
                onFocus={() => setPhoneNumberFocused(true)}
                error={!verifyPhoneNumber(phoneNumber) && phoneNumberFocused}
              />
              {!verifyPhoneNumber(phoneNumber) && phoneNumberFocused && (
                <Text className={"text-red-700"}>
                  Please enter a valid phone number.
                </Text>
              )}
            </View>

            <View className="mt-6">
              <TextInputPaper
                mode="outlined"
                label="Shop description"
                value={description}
                onChangeText={(text) => setDescription(text)}
                underlineColor="#0099F9"
                activeUnderlineColor="#0099F9"
                outlineColor="#0099F9"
                activeOutlineColor="#0099F9"
                multiline={true}
                className="bg-white mb-4 max-h-40"
                onFocus={() => setDescriptionFocused(true)}
                error={!verifyText(description) && descriptionFocused}
              />
              {!verifyText(description) && descriptionFocused && (
                <Text className={"text-red-700"}>
                  Please enter a valid description.
                </Text>
              )}
            </View>

            <View className="mt-6">
              <Text className="text-lg font-semibold">Category</Text>
              <View className="flex flex-row mt-2 border-b border-gray-400">
                <Text className="flex-1">
                  {category || "No category selected"}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text className="text-blue-500 text-lg font-semibold">
                    Select
                  </Text>
                </TouchableOpacity>
              </View>
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
                    category: categoryId,
                    logo,
                  },
                })
              }
              disabled={!valid}
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
