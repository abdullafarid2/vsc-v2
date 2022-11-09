import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { StarIcon } from "react-native-heroicons/solid";
import { useTailwind } from "tailwindcss-react-native";
import { doc, setDoc } from "firebase/firestore";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

const ShopTitle = ({ shopDetails, products }) => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    const chatId = user.id + "+" + shopDetails.owner_id + "+" + shopDetails.id;

    await setDoc(doc(db, "chats", chatId), {
      shopId: shopDetails.id,
      customerId: chatId.split("+")[0],
      ownerId: chatId.split("+")[1],
    })
      .then(() => {
        navigation.navigate("MessagesStack", {
          screen: "Messages",
          params: {
            chat: {
              chatId,
              shop: { ...shopDetails },
            },
          },
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <View>
      <View className="flex flex-row my-3">
        <Image
          source={{ uri: shopDetails.logo }}
          className="rounded rounded-full h-24 w-24"
          resizeMode="contain"
        />

        <View className="flex-1 ml-3">
          <Text className="text-lg font-bold">{shopDetails.name}</Text>

          <Text className="text-gray-500 font-semibold mt-1">
            {shopDetails.category_name}
          </Text>

          <View className="flex-row mt-1 items-center">
            {shopDetails.rating &&
              shopDetails.rating > 0 &&
              Array(Math.round(shopDetails.rating))
                .fill()
                .map((_, i) => (
                  <StarIcon
                    key={i}
                    color={"#FFC700"}
                    style={tw(`-ml-1`)}
                    size={30}
                  />
                ))}

            {shopDetails.rating ? (
              <Text className="text-[#838383] font-semibold">
                ({Math.round(shopDetails.rating)})
              </Text>
            ) : (
              <Text className="text-[#838383]">No rating available</Text>
            )}
          </View>

          {shopDetails.owner_id === user.id ? (
            <TouchableOpacity>
              <Text className="text-blue-500 font-bold mt-1">Edit Shop</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Text className="text-blue-500 font-bold mt-1">More Info</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="mt-1">
          {shopDetails.owner_id === user.id ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("SearchProduct", {
                  products,
                  ...shopDetails,
                })
              }
            >
              <Text className="text-blue-500 font-bold mt-1">
                Edit Products
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => sendMessage()}>
              <Text className="text-blue-500 font-bold mt-1">Send Message</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity className="flex-1 mt-5">
            <Text className="text-blue-500 font-bold mt-1 self-end">
              Reviews
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <ActivityIndicator animating={true} color={MD2Colors.blue500} />
      )}
    </View>
  );
};

export default ShopTitle;
