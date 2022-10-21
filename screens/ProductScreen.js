import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";
import { ActivityIndicator, RadioButton, TextInput } from "react-native-paper";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import { useHeaderHeight } from "@react-navigation/elements";
import { MinusIcon, PlusIcon } from "react-native-heroicons/solid";
import useCart from "../hooks/useCart";
import Toast from "react-native-toast-message";

const ProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const tw = useTailwind();
  const { addToCart } = useCart();
  const { product, fixedPrice } = route.params;
  const height = useHeaderHeight();

  const [loading, setLoading] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [size, setSize] = useState();
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    for (let i = 0; i < product.sizes.length; i++) {
      const s = product.sizes[i];
      if (s.quantity !== 0) {
        setSize(s);
        break;
      }
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <View className="flex-1 bg-white">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="absolute p-2 z-50 rounded rounded-full bg-gray-200 top-10 left-3"
      >
        <ChevronLeftIcon size={26} color={"#000"} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={height}
      >
        <ScrollView>
          <View className="justify-center h-96">
            <Image
              source={{ uri: product?.photo }}
              loadingIndicatorSource={{ uri: product?.photo }}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              className={`${loading ? "h-0" : "h-96"}`}
            />
            {loading && <ActivityIndicator size="large" animating={loading} />}
          </View>

          <View className="bg-white border border-gray-300 rounded-t-xl -top-5 px-3 py-4">
            <Text className="text-xl font-semibold">{product.name}</Text>
            <Text className="mt-2 text-gray-600">{product.description}</Text>

            <View className="flex-row justify-between">
              {size ? (
                <Text className="text-lg font-semibold mt-2">
                  {(Math.round(size.price * quantity * 1000) / 1000).toFixed(3)}{" "}
                  BD
                </Text>
              ) : (
                <Text className="text-lg font-semibold mt-2 text-red-500">
                  Out of stock
                </Text>
              )}

              <View className="flex-row items-center border border-gray-300 rounded rounded-xl p-1">
                <TouchableOpacity
                  onPress={() => setQuantity(quantity - 1)}
                  className="mx-2"
                  disabled={!size || quantity === 1}
                >
                  <MinusIcon
                    size={20}
                    style={tw(
                      `${
                        !size || quantity === 1
                          ? "text-gray-500"
                          : "text-blue-500"
                      }`
                    )}
                  />
                </TouchableOpacity>

                <Text className="mx-2 text-lg">{quantity}</Text>

                <TouchableOpacity
                  onPress={() => setQuantity(quantity + 1)}
                  className="mx-2"
                  disabled={!size}
                >
                  <PlusIcon
                    size={20}
                    style={tw(`${!size ? "text-gray-500" : "text-blue-500"}`)}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex-1 px-3">
            {product.sizes.length > 1 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold mb-2">Select Size</Text>
                <RadioButton.Group
                  onValueChange={(newValue) => setSize(newValue)}
                  value={size}
                >
                  {product.sizes.map((s, i) => (
                    <TouchableOpacity
                      onPress={() => setSize(s)}
                      activeOpacity={1}
                      className="flex-row items-center border-b border-gray-200 pl-2"
                      key={i}
                      disabled={s.quantity === 0}
                    >
                      <Text className="flex-1 text-lg">{s.size}</Text>

                      {s.quantity === 0 && (
                        <Text className="text-red-500">Out of stock</Text>
                      )}

                      {!fixedPrice && (
                        <Text className="mx-3">
                          {(Math.round(s.price * 1000) / 1000).toFixed(3)} BD
                        </Text>
                      )}
                      <RadioButton.Android
                        value={s}
                        color={s.quantity === 0 ? "#8b8b8b" : "#0099F9"}
                        disabled={s.quantity === 0}
                      />
                    </TouchableOpacity>
                  ))}
                </RadioButton.Group>
              </View>
            )}

            <View className="">
              <Text className="text-lg mb-2">Notes (optional)</Text>
              <TextInput
                mode="outlined"
                label="Note"
                value={note}
                onChangeText={(text) => setNote(text)}
                underlineColor="#0099F9"
                activeUnderlineColor="#0099F9"
                outlineColor="#0099F9"
                activeOutlineColor="#0099F9"
                multiline={true}
                className="bg-white max-h-40"
              />
            </View>

            {addToCartLoading ? (
              <TouchableOpacity className="my-3 bg-blue-500 rounded rounded-lg p-3 justify-center items-center">
                <ActivityIndicator animating={addToCartLoading} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setAddToCartLoading(true);
                  addToCart(product, size, quantity, note).then(() => {
                    setAddToCartLoading(false);
                    Toast.show({
                      text1: "Successfully added item to cart!",
                    });
                    navigation.goBack();
                  });
                }}
                disabled={!size}
                className={`mt-5 mb-3 bg-blue-500 rounded rounded-lg p-3 justify-center items-center ${
                  !size && "bg-gray-400"
                }`}
              >
                <Text className="text-lg font-semibold text-white">
                  Add to cart
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ProductScreen;
