import { View, Text, FlatList } from "react-native";
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useNotifications from "../hooks/useNotifications";
import NotificationRow from "../components/NotificationRow";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import sortBy from "lodash.sortby";

const NotificationsScreen = () => {
  const navigation = useNavigation();

  const { notifications } = useNotifications();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        notifications.map(async (notification) => {
          const docRef = doc(db, "notifications", notification.id);
          await updateDoc(docRef, {
            read: true,
          });
        });
      }, 5000);
    }, [notifications])
  );
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar />
      <View className="flex-1 bg-white px-3">
        <FlatList
          data={notifications}
          renderItem={({ item }) => <NotificationRow notification={item} />}
          keyExtractor={(item) => item.id}
          className="mt-3"
          ListHeaderComponent={
            <View>
              <Text className="text-2xl font-semibold ">Notifications</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
