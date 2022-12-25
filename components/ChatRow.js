import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Avatar, Badge } from "react-native-paper";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { useTailwind } from "tailwindcss-react-native";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";

const ChatRow = ({ chat }) => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const { user } = useAuth();

  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "chats", chat.chatId, "messages"),
      where("read", "==", false),
      where("senderId", "==", chat.chatId.split("+")[1])
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
        user.id == chat.chatId.split("+")[0]
          ? navigation.navigate("Chat", {
              chat,
            })
          : navigation.navigate("CustomerChatList", {
              chat,
            })
      }
      className="flex flex-row items-center border-b border-gray-300 py-2 px-4"
    >
      <Avatar.Image size={75} source={{ uri: chat?.shop?.logo }} />
      <Text className="flex-1 text-lg font-semibold ml-8">
        {chat?.shop?.name}
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

export default ChatRow;