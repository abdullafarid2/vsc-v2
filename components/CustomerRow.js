import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTailwind } from "tailwindcss-react-native";
import { useNavigation } from "@react-navigation/native";
import useShops from "../hooks/useShops";
import { Badge } from "react-native-paper";
import {
  ChevronRightIcon,
  UserCircleIcon,
} from "react-native-heroicons/outline";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";

const CustomerRow = ({ customer }) => {
  const tw = useTailwind();
  const navigation = useNavigation();

  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "chats", customer.chatId, "messages"),
      where("read", "==", false),
      where("senderId", "==", customer.chatId.split("+")[0])
    );
    return onSnapshot(messagesQuery, (snapshot) => {
      setUnreadMessages(0);
      snapshot.forEach((doc) => {
        setUnreadMessages((unreadMessages) => unreadMessages + 1);
      });
    });
  }, []);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ChatShopOwner", {
          chatId: customer.chatId,
          user: customer.user,
        })
      }
      className="flex flex-row items-center border-b border-gray-300 p-4 bg-white"
    >
      <UserCircleIcon size={24} style={tw("text-black")} />
      <Text className="flex-1 text-lg font-semibold ml-8">
        {customer.user.first_name + " " + customer.user.last_name}
      </Text>
      {unreadMessages > 0 && (
        <Badge
          size={26}
          style={tw("self-center bg-red-600 font-semibold mr-2")}
        >
          {unreadMessages}
        </Badge>
      )}

      <ChevronRightIcon size={24} style={tw("text-gray-400")} />
    </TouchableOpacity>
  );
};

export default CustomerRow;
