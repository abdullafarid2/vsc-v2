import React from "react";
import { Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import { useTailwind } from "tailwindcss-react-native";

const ChatBubble = ({ message, me, shop }) => {
  const tw = useTailwind();
  return (
    <View>
      {me ? (
        <View
          className="flex flex-row rounded rounded-lg bg-blue-500 p-2 ml-10 mb-2"
          style={{ alignSelf: "flex-end" }}
        >
          <View className="px-1">
            <Text className="text-white font-bold">You</Text>
            <Text className="text-white mt-2">{message}</Text>
          </View>
        </View>
      ) : (
        <View
          className="flex flex-row rounded rounded-lg bg-gray-800 p-2 mr-10 mb-2"
          style={{ alignSelf: "flex-start" }}
        >
          {/*<Avatar.Image size={50} source={{ uri: shop.logo }} />*/}
          <View className="px-1">
            <Text className="text-white font-bold">{shop.name}</Text>
            <Text className="text-white mt-2">{message}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ChatBubble;
