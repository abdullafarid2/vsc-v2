import { View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  MD2Colors,
  SegmentedButtons,
} from "react-native-paper";
import { useTailwind } from "tailwindcss-react-native";
import ChatList from "../components/ChatList";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import useShops from "../hooks/useShops";
import ChatShopsList from "../components/ChatShopsList";
import { useNavigation, useRoute } from "@react-navigation/native";

const MessagesScreen = () => {
  const tw = useTailwind();
  const route = useRoute();
  const navigation = useNavigation();

  const chat = route?.params?.chat;

  const { user } = useAuth();
  const { shops } = useShops();

  const [userShops, setUserShops] = useState([]);

  const [myChats, setMyChats] = useState([]);
  const [shopChats, setShopChats] = useState([]);
  const [type, setType] = useState("My Messages");

  const [loading, setLoading] = useState(true);

  const getUserShops = () => {
    setUserShops(shops.filter((shop) => shop.owner_id === user.id));
  };

  useEffect(() => {
    getUserShops();

    return onSnapshot(query(collection(db, "chats")), (querySnapshot) => {
      setMyChats([]);
      setShopChats([]);
      querySnapshot.forEach((doc) => {
        const chatId = doc.id;
        const splitIds = chatId.split("+");

        const userId = splitIds[0];
        const ownerId = splitIds[1];
        const shopId = splitIds[2];

        if (userId == user.id || ownerId == user.id) {
          const shop = shops.filter((shop) => shop.id == shopId);

          userId == user.id
            ? setMyChats((chats) => [...chats, { chatId, shop: shop[0] }])
            : setShopChats((chats) => [...chats, { chatId, shop: shop[0] }]);
        }
      });

      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (chat) {
      navigation.navigate("Chat", {
        chat,
      });
    }
  }, [chat]);

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
        {loading ? (
          <ActivityIndicator
            animating={true}
            color={MD2Colors.blue500}
            size="large"
            style={tw("mt-5")}
          />
        ) : (
          <>
            {type === "My Messages" && myChats.length > 0 && (
              <ChatList chats={myChats} />
            )}

            {type === "Shop Messages" && shopChats.length > 0 && (
              <ChatShopsList chats={shopChats} />
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default MessagesScreen;
