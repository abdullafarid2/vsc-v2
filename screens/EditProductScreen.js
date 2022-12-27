import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
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
import { ActivityIndicator, TextInput } from "react-native-paper";
import MultipleSizesDifferentPrice from "../components/MultipleSizesDifferentPrice";
import EditProductSizes from "../components/EditProductSizes";
import useAuth from "../hooks/useAuth";
import { launchImageLibraryAsync } from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Toast from "react-native-toast-message";

const EditProductScreen = () => {
  const tw = useTailwind();
  const route = useRoute();
  const navigation = useNavigation();

  const { url } = useAuth();
  let { product: pid } = route.params;

  const [product, setProduct] = useState(null);
  const [productName, setProductName] = useState();
  const [description, setDescription] = useState();
  const [sizes, setSizes] = useState();
  const [photo, setPhoto] = useState();
  const [loading, setLoading] = useState(false);

  const getProduct = async () => {
    try {
      const res = await fetch(url + "/product/" + pid.id, {
        method: "GET",
      });

      const data = await res.json();

      setProductName(data[0].name);
      setDescription(data[0].description);
      setSizes(data[0].sizes);
      setPhoto(data[0].photo);

      setProduct(data[0]);
    } catch (e) {
      console.log(e.message);
    }
  };

  const updateProduct = async () => {
    try {
      if (photo !== pid.photo) {
        setLoading(true);
        const photoUrl = await uploadImageAsync(photo);
      }

      const res = await fetch(url + "/product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: {
            id: pid.id,
            name: productName,
            description,
            photo,
            sizes,
          },
        }),
      });

      const data = await res.json();

      setLoading(false);

      if (data) {
        pid = data;
        navigation.goBack();
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const deleteProduct = async () => {
    try {
      const res = await fetch(url + "/product/delete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: pid.id,
        }),
      });

      const data = await res.json();

      if (data) {
        const popAction = StackActions.pop(2);
        navigation.dispatch(popAction);
      } else {
        Toast.show({
          type: "error",
          text1: "An error has occured.",
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPhoto(result.uri);
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

  useEffect(() => {
    getProduct();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: tw("bg-blue-500"),
      headerTintColor: "#FFFFFF",
      headerTitle: "",
    });
  }, []);

  return (
    <View className={"flex-1 bg-white px-3"}>
      {product && (
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView className={"mt-3"}>
            <View className={"flex-row justify-between items-center my-3"}>
              <Text className={"text-xl font-semibold"}>Edit Product</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AddOffer", {
                    product: pid,
                  })
                }
                className={"bg-blue-500 px-4 py-3 rounded rounded-lg"}
              >
                <Text className={"text-white font-medium"}>Add Offer</Text>
              </TouchableOpacity>
            </View>

            <View className={"justify-center items-center mt-4"}>
              <Image
                source={{ uri: photo }}
                className={"h-40 w-40 rounded rounded-lg"}
              />
              <TouchableOpacity onPress={() => pickImage()}>
                <Text className={"text-blue-500 font-medium mt-2"}>
                  Change Photo
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              mode="flat"
              label="Product Name"
              placeholder="Product name"
              value={productName}
              onChangeText={(text) => setProductName(text)}
              underlineColor="#0099F9"
              activeUnderlineColor="#0099F9"
              className={"mt-6 bg-white"}
            />

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
              className={"bg-white max-h-40 mt-8 bg-white"}
            />

            {product?.sizes?.length === 1 ? (
              <>
                <TextInput
                  label="Price"
                  underlineColor="#0099F9"
                  activeUnderlineColor="#0099F9"
                  className="bg-white mt-5"
                  value={sizes[0].price.toString()}
                  onChangeText={(text) =>
                    setSizes([{ ...sizes[0], price: text }])
                  }
                  render={(props) => (
                    <RNTextInput {...props} keyboardType="numeric" />
                  )}
                />

                <TextInput
                  label="Quantity"
                  underlineColor="#0099F9"
                  activeUnderlineColor="#0099F9"
                  className="bg-white mt-5"
                  value={sizes[0].quantity.toString()}
                  onChangeText={(text) =>
                    setSizes([{ ...sizes[0], quantity: text }])
                  }
                  render={(props) => (
                    <RNTextInput {...props} keyboardType="numeric" />
                  )}
                />
              </>
            ) : (
              <View className={"mt-6"}>
                <EditProductSizes
                  setSizes={setSizes}
                  sizes={sizes}
                  numberOfSizes={product?.sizes?.length}
                />
              </View>
            )}

            {loading ? (
              <TouchableOpacity className="my-5 bg-blue-500 rounded rounded-lg p-3 justify-center items-center">
                <ActivityIndicator animating={loading} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => updateProduct()}
                className="mt-8 bg-blue-500 rounded rounded-lg p-3 justify-center items-center"
              >
                <Text className="text-lg font-semibold text-white">Save</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => deleteProduct()}
              className="my-3 bg-red-500 rounded rounded-lg p-3 justify-center items-center"
            >
              <Text className="text-lg font-semibold text-white">Delete</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default EditProductScreen;
