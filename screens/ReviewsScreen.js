import React, { useEffect, useLayoutEffect, useState } from "react";
import { Text, View } from "react-native";
import { useTailwind } from "tailwindcss-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Rating from "../components/Rating";
import useAuth from "../hooks/useAuth";

const Reviews = () => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const route = useRoute();
  const { url } = useAuth();
  const { shopDetails: shop } = route.params;

  const [reviews, setReviews] = useState([]);

  const getReviews = async () => {
    try {
      const res = await fetch(url + "/reviews/" + shop.id, {
        method: "GET",
      });

      const data = await res.json();

      setReviews(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: tw("bg-blue-500"),
      headerTintColor: "#FFFFFF",
      headerTitle: "",
    });
  }, []);

  return (
    <View className={"flex-1 bg-white px-3"}>
      <Text className={"text-xl font-semibold my-3"}>Reviews</Text>
      {/*  Rating box */}
      <Rating setReviews={setReviews} />
      {/*  Average Rating */}

      {/*  Reviews */}
    </View>
  );
};

export default Reviews;
