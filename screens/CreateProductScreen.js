import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import {
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  RadioButton,
  TextInput,
} from "react-native-paper";
import { CheckIcon } from "react-native-heroicons/outline";
import useAuth from "../hooks/useAuth";
import Toast from "react-native-toast-message";
import { useHeaderHeight } from "@react-navigation/elements";
import { launchImageLibraryAsync } from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import MultipleSizesFixedPrice from "../components/MultipleSizesFixedPrice";
import MultipleSizesDifferentPrice from "../components/MultipleSizesDifferentPrice";

const CreateProduct = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const tw = useTailwind();
  const { url } = useAuth();
  const height = useHeaderHeight();
  const { ...shopDetails } = route.params;

  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState({ name: "", id: null });

  // let sizes = [];
  const [singleSize, setSingleSize] = useState([
    {
      size: null,
      price: 0,
      quantity: 0,
    },
  ]);
  const [sizes, setSizes] = useState([]);

  const [isPriceFixed, setIsPriceFixed] = useState("yes");
  const [multipleSizes, setMultipleSizes] = useState("no");

  const [fixedPrice, setFixedPrice] = useState(0);

  const [fixedPhoto, setFixedPhoto] = useState("");
  const [numberOfSizes, setNumberOfSizes] = useState(0);

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

  const addCategory = async () => {
    try {
      const res = await fetch(url + "/newProductCategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newCategory,
          shopId: shopDetails.id,
        }),
      });

      const data = await res.json();

      console.log(...data);

      if (data) {
        setCategories((categories) => [...categories, ...data]);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "An unexpected error occurred. Please try again",
          visibilityTime: 4000,
          topOffset: 50,
        });
      }

      setNewCategory("");
    } catch (e) {
      console.log(e.message);
    }
  };

  const createProduct = async () => {
    try {
      setLoading(true);
      const photoUrl = await uploadImageAsync(fixedPhoto);

      //single size
      const res = await fetch(url + "/newProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productName,
          description,
          category: category.id,
          sizes: multipleSizes === "yes" ? sizes : singleSize,
          photo: photoUrl,
          shopId: shopDetails.id,
        }),
      });

      const data = await res.json();

      setLoading(false);
      const popAction = StackActions.pop(2);
      navigation.dispatch(popAction);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      const res = await fetch(url + "/productCategories/" + shopDetails.id, {
        method: "GET",
      });

      const data = await res.json();

      setCategories(data);
    };

    getCategories();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: tw("bg-blue-500"),
      headerTintColor: "#fff",
    });
  }, []);

  return (
    <View className="flex-1 bg-white px-3">
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1 bg-white px-3">
            <Text className="text-black font-bold text-xl mt-4">
              New Category
            </Text>
            <View className="flex flex-row items-center border-b border-gray-300">
              <TextInput
                mode="flat"
                label="New Category"
                placeholder="Sandwiches, Shirts, Phones, etc..."
                value={newCategory}
                onChangeText={(text) => setNewCategory(text)}
                underlineColor="#0099F9"
                activeUnderlineColor="#0099F9"
                className="bg-white mb-4 flex-1"
              />
              <TouchableOpacity
                onPress={() => addCategory()}
                className="bg-blue-500 rounded roudned-lg p-2 px-4 ml-4"
              >
                <Text className="text-white font-semibold">Add</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-black font-bold text-xl mt-4">
              Select Category
            </Text>

            <FlatList
              data={categories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex flex-row border-b border-gray-200 py-2 items-center"
                  onPress={() => setCategory({ name: item.name, id: item.id })}
                >
                  <Text className="text-lg">{item.name}</Text>

                  {category.id === item.id && (
                    <View className="flex-1 flex-row justify-end">
                      <CheckIcon style={tw("text-blue-500")} />
                    </View>
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              className="mt-4"
            />

            <TouchableOpacity
              className="bg-blue-500 items-center justify-center p-3 rounded-lg my-6"
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text className="text-white font-semibold text-lg">Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={height}
      >
        <ScrollView>
          <Text className="text-xl my-3 font-semibold">Create product</Text>
          <TextInput
            mode="flat"
            label="Product name"
            value={productName}
            onChangeText={(text) => setProductName(text)}
            underlineColor="#0099F9"
            activeUnderlineColor="#0099F9"
            className="bg-white mb-4"
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
            className="bg-white mb-4 max-h-40"
          />

          <View className="flex flex-row items-center">
            <TextInput
              mode="flat"
              label="Category"
              value={category.name}
              underlineColor="#0099F9"
              activeUnderlineColor="#0099F9"
              className="bg-white mb-4 flex-1"
              editable={false}
            />
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text className="text-blue-500 font-semibold">
                Select Category
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="font-semibold mt-3 mb-2">
            Does your product have multiple sizes?
          </Text>

          <RadioButton.Group
            onValueChange={(newValue) => {
              setMultipleSizes(newValue);
              newValue === "no" && setNumberOfSizes(0);
            }}
            value={multipleSizes}
          >
            <View className="flex flex-row items-center">
              <RadioButton.Android value="yes" color="#0099F9" />
              <Text>Yes</Text>
            </View>

            <View className="flex flex-row items-center">
              <RadioButton.Android value="no" color="#0099F9" />
              <Text>No</Text>
            </View>
          </RadioButton.Group>

          {multipleSizes === "yes" && (
            <>
              <TextInput
                label="Number of sizes"
                underlineColor="#0099F9"
                activeUnderlineColor="#0099F9"
                className="bg-white mb-4"
                value={numberOfSizes}
                onChangeText={(text) => setNumberOfSizes(text)}
                render={(props) => (
                  <RNTextInput {...props} keyboardType="numeric" />
                )}
                error={numberOfSizes > 6 || numberOfSizes < 2}
              />
              {numberOfSizes > 6 && (
                <Text className="text-red-700 text-sm">
                  Maximum 6 sizes allowed.
                </Text>
              )}
              {numberOfSizes < 2 && (
                <Text className="text-red-700 text-sm">
                  Minimum 2 sizes allowed.
                </Text>
              )}
            </>
          )}

          {multipleSizes === "no" ? (
            <TextInput
              label="Price"
              underlineColor="#0099F9"
              activeUnderlineColor="#0099F9"
              className="bg-white mb-4"
              value={singleSize[0].price}
              onChangeText={(text) => (singleSize[0].price = text)}
              render={(props) => (
                <RNTextInput {...props} keyboardType="numeric" />
              )}
              right={<TextInput.Affix text="BHD" />}
            />
          ) : (
            <>
              <Text className="font-semibold mt-3 mb-2">
                Is the price of your product fixed? (Does not change based on
                size)
              </Text>

              <RadioButton.Group
                onValueChange={(newValue) => {
                  setIsPriceFixed(newValue);
                  newValue === "no" && setFixedPrice(0);
                }}
                value={isPriceFixed}
              >
                <View className="flex flex-row items-center">
                  <RadioButton.Android value="yes" color="#0099F9" />
                  <Text>Yes</Text>
                </View>

                <View className="flex flex-row items-center">
                  <RadioButton.Android value="no" color="#0099F9" />
                  <Text>No</Text>
                </View>
              </RadioButton.Group>
              {isPriceFixed === "yes" && (
                <TextInput
                  label="Fixed Price"
                  underlineColor="#0099F9"
                  activeUnderlineColor="#0099F9"
                  className="bg-white mb-4"
                  value={fixedPrice}
                  onChangeText={(text) => setFixedPrice(text)}
                  render={(props) => (
                    <RNTextInput {...props} keyboardType="numeric" />
                  )}
                  right={<TextInput.Affix text="BHD" />}
                />
              )}

              {numberOfSizes > 1 && numberOfSizes < 7 && (
                <>
                  {isPriceFixed === "yes" && fixedPrice > 0 && (
                    <MultipleSizesFixedPrice
                      sizes={sizes}
                      fixedPrice={fixedPrice}
                      numberOfSizes={numberOfSizes}
                      setSizes={setSizes}
                    />
                  )}

                  {isPriceFixed === "no" && (
                    <MultipleSizesDifferentPrice
                      sizes={sizes}
                      numberOfSizes={numberOfSizes}
                      setSizes={setSizes}
                    />
                  )}
                </>
              )}
            </>
          )}

          {multipleSizes === "no" && (
            <View>
              <TextInput
                label="Quantity"
                underlineColor="#0099F9"
                activeUnderlineColor="#0099F9"
                className="bg-white mb-4"
                value={singleSize[0].quantity}
                onChangeText={(text) => (singleSize[0].quantity = text)}
                render={(props) => (
                  <RNTextInput {...props} keyboardType="numeric" />
                )}
              />
            </View>
          )}

          <View className="border border-gray-400 p-2 mb-4">
            <Image
              source={{
                uri:
                  fixedPhoto ||
                  "https://static.vecteezy.com/system/resources/previews/007/567/154/original/select-image-icon-vector.jpg",
              }}
              resizeMode="contain"
              className="h-48 w-48 self-center"
            />
            <View className="justify-center items-center mt-2">
              <TouchableOpacity
                onPress={() => pickImage(setFixedPhoto)}
                className="bg-blue-500 p-2 rounded rounded-lg justify-center items-center"
              >
                <Text className="text-white font-semibold">Upload Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <TouchableOpacity className="my-3 bg-blue-500 rounded rounded-lg p-3 justify-center items-center">
              <ActivityIndicator animating={loading} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => createProduct()}
              className="my-3 bg-blue-500 rounded rounded-lg p-3 justify-center items-center"
            >
              <Text className="text-lg font-semibold text-white">
                Create Product
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateProduct;
