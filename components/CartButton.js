import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ShoppingCartIcon } from "react-native-heroicons/outline";
import { Badge } from "@rneui/base";
import { useTailwind } from "tailwindcss-react-native";

const CartButton = () => {
  const tw = useTailwind();
  return (
    <View className="absolute z-20 right-0">
      <View className="p-4">
        <TouchableOpacity
          style={[
            tw("rounded rounded-full p-2 bg-blue-400"),
            {
              shadowOffset: { height: "2px", width: "2px" },
              shadowColor: "#000000",
              shadowOpacity: 5,
            },
          ]}
        >
          <ShoppingCartIcon size={30} color="#0f0f0f" />
        </TouchableOpacity>
        <Badge
          status="error"
          value={0}
          containerStyle={{ position: "absolute", top: 10, left: 50 }}
        />
      </View>
    </View>
  );
};

export default CartButton;
