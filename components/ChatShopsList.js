import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import ChatShopRow from "./ChatShopRow";

const ChatShopsList = ({ chats }) => {
  const [userShops, setUserShops] = useState([]);

  useEffect(() => {
    setUserShops([]);
    chats.map((chat) => {
      if (userShops.indexOf(chat.shop) < 0) {
        userShops.push(chat.shop);
      }
    });

    setUserShops([...new Set(userShops)]);
  }, [chats]);

  return (
    <FlatList
      data={userShops}
      renderItem={({ item }) => <ChatShopRow shop={item} chats={chats} />}
      keyExtractor={(item) => item.id}
    />
  );
};

export default ChatShopsList;
