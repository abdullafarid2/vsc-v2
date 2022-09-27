import React, { useEffect, useLayoutEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import useShops from "../hooks/useShops";
import { Avatar, Badge } from "react-native-paper";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { useTailwind } from "tailwindcss-react-native";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const ChatShopRow = ({ shop, chats }) => {
  const tw = useTailwind();
  const navigation = useNavigation();

  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const filteredChats = chats.filter((chat) => shop.id == chat.shop.id);
    const unsub = () => {
      filteredChats.map((chat) => {
        const messagesQuery = query(
          collection(db, "chats", chat.chatId, "messages"),
          where("read", "==", false),
          where("senderId", "==", chat.chatId.split("+")[0])
        );
        onSnapshot(messagesQuery, (snapshot) => {
          setUnreadMessages(0);
          snapshot.forEach((doc) => {
            setUnreadMessages((unreadMessages) => unreadMessages + 1);
          });
        });
      });
    };

    unsub();
  }, []);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("CustomerChatList", {
          shop,
          chats,
        })
      }
      className="flex flex-row items-center border-b border-gray-300 py-2 px-4"
    >
      <Avatar.Image size={75} source={{ uri: shop.logo }} />
      <Text className="flex-1 text-lg font-semibold ml-8">{shop.name}</Text>
      {unreadMessages > 0 && (
        <Badge
          size={25}
          style={tw("self-center bg-red-600 font-semibold mr-2")}
        >
          {unreadMessages}
        </Badge>
      )}

      <ChevronRightIcon size={24} style={tw("text-gray-400")} />
    </TouchableOpacity>
  );
};

export default ChatShopRow;
