import React, {
  useEffect,
  useLayoutEffect,
  useCallback,
  useState,
} from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useTailwind } from "tailwindcss-react-native";
import useCart from "../hooks/useCart";
import CartItem from "../components/CartItem";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import SelectAddressModal from "../components/SelectAddressModal";
import useAuth from "../hooks/useAuth";
import isEqual from "lodash.isequal";
import { ActivityIndicator } from "react-native-paper";

const CartScreen = () => {
  const tw = useTailwind();
  const {
    cart,
    cartItems,
    numberOfItems,
    total,
    getCartItems,
    clearCart,
    placeOrder,
  } = useCart();
  const { user } = useAuth();
  const navigation = useNavigation();

  const [address, setAddress] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      getCartItems();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar />
      <View className="flex-1 bg-white px-3">
        <SelectAddressModal
          selected={address}
          data={user.address}
          setSelect={setAddress}
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
        />
        <FlatList
          data={cartItems}
          renderItem={({ item }) => <CartItem item={item} />}
          keyExtractor={(item) => item.cartId}
          className="mt-3"
          ListHeaderComponent={
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="mt-3 text-2xl font-semibold">Cart</Text>
                <Text className="mt-1 font-medium">
                  {numberOfItems} item(s) in cart
                </Text>
              </View>
              {numberOfItems > 0 && (
                <View>
                  <TouchableOpacity
                    onPress={() => clearCart()}
                    className="rounded rounded-full bg-red-600 px-3 py-2 justify-center"
                  >
                    <Text className="text-white font-medium">Clear</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          }
          ListFooterComponent={
            <>
              {cartItems.length > 0 && (
                <View className="border-t border-gray-400 mt-3 pt-3">
                  <View className="flex-row justify-between items-center my-3">
                    <Text className="text-lg">Delivering to</Text>
                    {address.name ? (
                      <Text className="font-medium text-lg">
                        {address?.name} ({address?.area})
                      </Text>
                    ) : (
                      <Text>Address not selected</Text>
                    )}

                    <TouchableOpacity
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text className="text-blue-500 font-medium">
                        Select Address
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="font-medium text-lg">Total</Text>
                    <Text className="font-medium text-lg">
                      {(Math.round(total * 1000) / 1000).toFixed(3)} BD
                    </Text>
                  </View>
                  {addLoading ? (
                    <TouchableOpacity className="my-3 bg-blue-500 rounded rounded-lg p-3 justify-center items-center">
                      <ActivityIndicator animating={addLoading} color="#fff" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setAddLoading(true);
                        placeOrder(address).then(() => {
                          setAddLoading(false);
                        });
                      }}
                      disabled={cartItems.length === 0 || isEqual(address, {})}
                      className={`mt-5 mb-3 bg-blue-500 rounded rounded-lg p-3 justify-center items-center ${
                        (cartItems.length === 0 || isEqual(address, {})) &&
                        "bg-gray-400"
                      }`}
                    >
                      <Text className="text-lg font-semibold text-white">
                        Place Order
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;
