import React from "react";
import { FlatList, View } from "react-native";
import ChatRow from "./ChatRow";

const ChatList = ({ chats }) => {
  return (
    <FlatList
      data={chats}
      renderItem={({ item }) => <ChatRow chat={item} />}
      keyExtractor={(item) => item.chatId}
    />
  );
};

export default ChatList;
