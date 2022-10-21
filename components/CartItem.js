import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import useShops from "../hooks/useShops";
import { MinusIcon, PlusIcon } from "react-native-heroicons/solid";
import { useTailwind } from "tailwindcss-react-native";
import useCart from "../hooks/useCart";
import findIndex from "lodash.findindex";

const CartItem = ({ item }) => {
  const tw = useTailwind();
  const { getShop } = useShops();
  const { updateQuantity, error, setError, getCartItems } = useCart();

  const [shop, setShop] = useState({});

  useEffect(() => {
    const fetchShop = async () => {
      setShop(await getShop(item.shop_id));
    };
    fetchShop();
  }, []);

  useEffect(() => {
    if (item.quantity === 0) {
      getCartItems();
    }
  }, [item.quantity]);
  return (
    <View
      className={`flex-row items-center my-4 ${
        error == item.cartId && "border border-red-500 rounded rounded-lg p-2"
      }`}
    >
      <View className="flex-1 pr-10">
        <View className="flex-row items-center">
          <Text className="text-lg font-medium">{item.name}</Text>
          {item.size && (
            <Text className="text-gray-500 font-medium ml-3">
              (Size: {item.size})
            </Text>
          )}
        </View>

        <Text className="text-gray-500">{shop.name}</Text>

        {item.note && (
          <Text className="text-gray-500 mt-2">Note: {item.note}</Text>
        )}

        <View className="flex-row items-end justify-between mt-2">
          <Text className="text-lg font-medium">
            {(Math.round(item.price * item.quantity * 1000) / 1000).toFixed(3)}{" "}
            BD
          </Text>

          <View className="flex-row items-center border border-gray-300 rounded rounded-xl p-1">
            <TouchableOpacity
              onPress={() => {
                updateQuantity(item, -1) && item.quantity--;

                error == item.cartId && setError(null);
              }}
              activeOpacity={1}
              className="mx-2"
            >
              <MinusIcon size={20} style={tw("text-blue-500")} />
            </TouchableOpacity>

            <Text className="mx-2 text-lg">{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => updateQuantity(item, 1) && item.quantity++}
              activeOpacity={1}
              className="mx-2"
              disabled={error == item.cartId}
            >
              <PlusIcon size={20} style={tw("text-blue-500")} />
            </TouchableOpacity>
          </View>
        </View>

        {error == item.cartId && (
          <Text className="text-red-500 text-sm">
            Quantity unavailable. Please reduce quantity and try again.
          </Text>
        )}
      </View>

      <Image
        source={{ uri: item.photo }}
        className="h-24 w-24 rounded rounded-xl self-end"
      />
    </View>
  );
};

export default CartItem;
