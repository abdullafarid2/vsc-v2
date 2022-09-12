import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import useShops from "../hooks/useShops";
import { Avatar, Badge } from "react-native-paper";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { useTailwind } from "tailwindcss-react-native";
import { useNavigation } from "@react-navigation/native";

const ChatRow = ({ chat }) => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const { shops } = useShops();

  // console.log(chat);

  const [shop, setShop] = useState({});

  const filter = () => {
    shops.map((s) => {
      if (s.id === chat.shopId) {
        setShop(s);
      }
    });
  };

  useEffect(() => {
    filter();
  }, []);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Chat", {
          chat,
          shop,
        })
      }
      className="flex flex-row items-center border-b border-gray-300 py-2 px-4"
    >
      <Avatar.Image size={75} source={{ uri: shop.logo }} />
      <Text className="flex-1 text-lg font-semibold ml-8">{shop.name}</Text>
      <Badge size={26} style={tw("self-center bg-red-600 font-semibold mr-2")}>
        2
      </Badge>
      <ChevronRightIcon size={24} style={tw("text-gray-400")} />
    </TouchableOpacity>
  );
};

export default ChatRow;
