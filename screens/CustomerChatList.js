import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import CustomerRow from "../components/CustomerRow";

const CustomerChatList = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { chats, shop } = route.params;

  const { url } = useAuth();

  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(url + "/users", {
        method: "GET",
      });

      const data = await res.json();

      setUsers(data);
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    fetchUsers().then((data) => {
      const filteredChats = chats.filter((chat) => shop.id == chat.shop.id);

      filteredChats.map((chat) => {
        const userId = chat.chatId.split("+")[0];

        data.map((user) => {
          if (user.id == userId) {
            setCustomers((customers) => [
              ...customers,
              { chatId: chat.chatId, user },
            ]);
          }
        });
      });
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Chats",
    });
  });

  return (
    <View className="flex-1">
      {customers.length > 0 && (
        <FlatList
          data={customers}
          renderItem={({ item }) => <CustomerRow customer={item} />}
          keyExtractor={(item) => item.user.id}
        />
      )}
    </View>
  );
};

export default CustomerChatList;
