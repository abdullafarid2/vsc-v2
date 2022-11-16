import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import StarRating from "react-native-star-rating-widget";
import { ActivityIndicator, TextInput } from "react-native-paper";
import useAuth from "../hooks/useAuth";
import Toast from "react-native-toast-message";

const Rating = ({ shopId, setReviews }) => {
  const { url, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    try {
      const res = await fetch(url + "/review/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          userId: user.id,
          rating: rating * 1,
          review: comment,
          date: new Date(),
        }),
      });

      const data = await res.json();

      if (data) {
        setReviews(data);
        Toast.show({ type: "success", text1: "Successfully added review!" });
      } else {
        Toast.show({ type: "error", text1: "An error has occurred." });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <View className={"mt-2"}>
      <Text className={"text-xl font-semibold my-3"}>Add Review</Text>
      <View className={"flex-row items-center justify-center"}>
        <StarRating
          rating={rating}
          maxStars={5}
          starSize={50}
          onChange={setRating}
          animationConfig={{ duration: 0, delay: 0, scale: 1 }}
        />
      </View>

      <TextInput
        mode="outlined"
        label="Comment (optional)"
        value={comment}
        onChangeText={(text) => setComment(text)}
        underlineColor="#0099F9"
        activeUnderlineColor="#0099F9"
        outlineColor="#0099F9"
        activeOutlineColor="#0099F9"
        multiline={true}
        className={"bg-white max-h-40 mt-6 bg-white"}
      />

      {loading ? (
        <TouchableOpacity className="my-5 bg-blue-500 rounded rounded-lg p-3 justify-center items-center">
          <ActivityIndicator animating={loading} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={submitReview}
          disabled={rating === 0}
          className={`mt-8 bg-blue-500 rounded rounded-lg p-3 justify-center items-center ${
            rating === 0 && "bg-gray-400"
          }`}
        >
          <Text className="text-lg font-semibold text-white">Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Rating;
