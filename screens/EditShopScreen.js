import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";
import { launchImageLibraryAsync } from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  ActivityIndicator,
  Divider,
  Menu,
  TextInput,
} from "react-native-paper";
import {
  verifyEmail,
  verifyPhoneNumber,
  verifyText,
} from "../utils/formValidation";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import useShops from "../hooks/useShops";
import Toast from "react-native-toast-message";

const EditShop = () => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const route = useRoute();
  const { shopDetails } = route.params;
  const { categories, updateShop } = useShops();

  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(shopDetails.logo);
  const [name, setName] = useState(shopDetails.name);
  const [category, setCategory] = useState({
    id: shopDetails.category,
    name: shopDetails.category_name,
  });
  const [email, setEmail] = useState(shopDetails.email);
  const [phone, setPhone] = useState(shopDetails.phone);
  const [description, setDescription] = useState(shopDetails.description);

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

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

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setLogo(result.uri);
    }
  };

  const update = async () => {
    setLoading(true);
    if (shopDetails.logo !== logo) {
      uploadImageAsync(logo).then((logoUrl) => {
        updateShop(
          shopDetails.id,
          name,
          email,
          phone,
          description,
          category.id,
          logoUrl
        ).then((res) => {
          setLoading(false);

          res
            ? Toast.show({
                type: "success",
                text1: "Successfully edited shop!",
              })
            : Toast.show({
                type: "error",
                text1: "An error has occurred.",
              });

          const popAction = StackActions.pop(2);

          res && navigation.dispatch(popAction);
        });
      });
    } else {
      updateShop(
        shopDetails.id,
        name,
        email,
        phone,
        description,
        category.id,
        logo
      ).then((res) => {
        setLoading(false);

        res
          ? Toast.show({
              type: "success",
              text1: "Successfully edited shop!",
            })
          : Toast.show({
              type: "error",
              text1: "An error has occurred.",
            });

        const popAction = StackActions.pop(2);

        res && navigation.dispatch(popAction);
      });
    }
    setLoading(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: tw("bg-blue-500"),
      headerTintColor: "#FFFFFF",
      headerTitle: "",
    });
  }, []);

  return (
    <View className={"flex-1 bg-white px-3"}>
      <ScrollView>
        <Text className={"text-xl font-semibold mt-3"}>Edit Shop</Text>

        <View className={"justify-center items-center mt-4"}>
          <View className={"border border-gray-400 rounded rounded-lg p-2"}>
            <Image
              source={{ uri: logo }}
              className={"h-32 w-32 rounded rounded-lg"}
            />
          </View>

          <TouchableOpacity onPress={() => pickImage()}>
            <Text className={"text-blue-500 font-medium mt-2"}>
              Change Logo
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          mode="flat"
          label="Shop Name"
          placeholder="Shop name"
          value={name}
          onChangeText={(text) => setName(text)}
          underlineColor="#0099F9"
          activeUnderlineColor="#0099F9"
          className={"mt-5 bg-white"}
          error={!verifyText(name)}
        />
        {!verifyText(name) && (
          <Text className={"text-red-600"}>Invalid input.</Text>
        )}

        <TextInput
          mode="flat"
          label="Shop Email"
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          underlineColor="#0099F9"
          activeUnderlineColor="#0099F9"
          className={"mt-4 bg-white"}
          error={!verifyEmail(email)}
        />
        {!verifyEmail(email) && (
          <Text className={"text-red-600"}>Invalid input.</Text>
        )}

        <TextInput
          mode="flat"
          label="Phone"
          placeholder="Phone"
          value={phone.toString()}
          onChangeText={(text) => setPhone(text)}
          underlineColor="#0099F9"
          activeUnderlineColor="#0099F9"
          className={"mt-4 bg-white"}
          error={!verifyPhoneNumber(phone)}
          render={(props) => <RNTextInput {...props} keyboardType="numeric" />}
        />
        {!verifyPhoneNumber(phone) && (
          <Text className={"text-red-600"}>Invalid input.</Text>
        )}

        <TextInput
          mode="outlined"
          label="Product description"
          value={description}
          onChangeText={(text) => setDescription(text)}
          underlineColor="#0099F9"
          activeUnderlineColor="#0099F9"
          outlineColor="#0099F9"
          activeOutlineColor="#0099F9"
          multiline={true}
          className={"bg-white max-h-40 mt-6 bg-white"}
        />

        <View className={"flex-row mt-5 items-center"}>
          <Text className={"text-lg font-medium mr-5"}>Category</Text>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <View className={"p-2 border border-gray-300 rounded rounded-md"}>
                <TouchableOpacity
                  onPress={openMenu}
                  className={"flex-row items-center"}
                >
                  <Text className={"text-lg mr-2"}>{category.name}</Text>
                  <ChevronDownIcon size={16} style={tw("text-black")} />
                </TouchableOpacity>
              </View>
            }
            contentStyle={tw("bg-white")}
          >
            {categories.map((cat, i) => (
              <View key={cat.id}>
                <Menu.Item
                  onPress={() => {
                    setCategory({ id: cat.id, name: cat.name });
                    closeMenu();
                  }}
                  title={cat.name}
                />
                {categories.length - i !== 1 && (
                  <Divider style={tw("bg-gray-300")} />
                )}
              </View>
            ))}
          </Menu>
        </View>

        {loading ? (
          <TouchableOpacity className="my-5 bg-blue-500 rounded rounded-lg p-3 justify-center items-center">
            <ActivityIndicator animating={loading} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={update}
            className="mt-8 bg-blue-500 rounded rounded-lg p-3 justify-center items-center"
          >
            <Text className="text-lg font-semibold text-white">Save</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default EditShop;
