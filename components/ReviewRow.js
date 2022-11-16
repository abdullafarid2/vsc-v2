import React from "react";
import { Text, View } from "react-native";
import StarRating from "react-native-star-rating-widget";
import { UserCircleIcon } from "react-native-heroicons/outline";
import { MD2Colors } from "react-native-paper";

const ReviewRow = ({ item: review }) => {
  return (
    <View pointerEvents={"none"}>
      <View className={"flex-row items-center justify-between"}>
        <View className={"flex-row items-center"}>
          <UserCircleIcon size={38} color={MD2Colors.grey500} />
          <Text className={"ml-2 text-lg font-medium"}>
            {review.first_name}
          </Text>
        </View>

        <View className={"flex-row items-center"}>
          <StarRating
            rating={review.rating}
            onChange={() => {}}
            maxStars={Math.ceil(review.rating)}
            starSize={25}
            className={"self-center"}
            starStyle={{ marginHorizontal: 1 }}
          />
          <Text className={"text-gray-500"}>({review.rating})</Text>
        </View>
      </View>

      <View className={"mt-2 px-4"}>
        <Text className={"text-gray-600 text-lg"}>{review.review}</Text>
      </View>
    </View>
  );
};

export default ReviewRow;
