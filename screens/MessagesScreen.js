import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { SegmentedButtons } from "react-native-paper";
import { useTailwind } from "tailwindcss-react-native";
import ChatList from "../components/ChatList";
import {
  getDocs,
  collection,
  getDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import useShops from "../hooks/useShops";

const MessagesScreen = () => {
  const { user } = useAuth();
  const { shops, getShops, getShop } = useShops();
  const tw = useTailwind();
  const [type, setType] = useState("My Messages");

  const [myChats, setMyChats] = useState([]);
  const [shopChats, setShopChats] = useState([]);

  const getMessages = async (chatId, setChat, chats, shopId) => {
    const q = await query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp")
    );

    onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });

      setChat([
        ...chats,
        {
          chatId,
          shopId,
          messages,
        },
      ]);
    });
  };

  useEffect(() => {
    return onSnapshot(query(collection(db, "chats")), (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const splitIds = doc.id.split("+");
        if (splitIds[0] === user.id) {
          getMessages(doc.id, setMyChats, myChats, doc.data().shopId);
        }
      });
    });
  }, []);

  return (
    <View className="flex-1 bg-white">
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        style={tw("w-full")}
        buttons={[
          {
            value: "My Messages",
            label: "My Messages",
            style: tw(
              `rounded-l-none w-1/2 border-gray-300 border-t-blue-300 ${
                type === "My Messages" && "bg-gray-300"
              }`
            ),
          },
          {
            value: "Shop Messages",
            label: "Shop Messages",
            style: tw(
              `rounded-none rounded-r-none w-1/2 border-gray-300 border-t-blue-300 ${
                type === "Shop Messages" && "bg-gray-300"
              }`
            ),
          },
        ]}
      />
      <View className="flex-1 ">
        {type === "My Messages" && myChats.length > 0 && (
          <ChatList chats={myChats} />
        )}

        {/*{type === "Shop Messages" && shopChats.length > 0 && (*/}
        {/*  <ChatList chats={shopChats} />*/}
        {/*)}*/}
      </View>
    </View>
  );
};

export default MessagesScreen;
