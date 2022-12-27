import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTailwind } from "tailwindcss-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Rating from "../components/Rating";
import useAuth from "../hooks/useAuth";
import { ActivityIndicator, Divider, MD2Colors } from "react-native-paper";
import ReviewRow from "../components/ReviewRow";
import { StarIcon } from "react-native-heroicons/solid";

const Reviews = () => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const route = useRoute();
  const { url, user } = useAuth();
  const { shopDetails: shop } = route.params;

  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [didUserReview, setDidUserReview] = useState(false);

  const getReviews = async () => {
    try {
      const res = await fetch(url + "/reviews/" + shop.id, {
        method: "GET",
      });

      const data = await res.json();

      setReviews(data);

      return true;
    } catch (e) {
      console.log(e.message);
    }
  };

  const calculateAverageRating = () => {
    let sum = 0;
    reviews.map((rev) => {
      sum += rev.rating;
    });

    return sum / reviews.length;
  };

  useEffect(() => {
    getReviews().then((res) => {
      if (res) setLoading(false);
    });
  }, []);

  useEffect(() => {
    reviews.filter((rev) => rev.user_id === user.id).length > 0 &&
      setDidUserReview(true);
  }, [reviews]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: tw("bg-blue-500"),
      headerTintColor: "#FFFFFF",
      headerTitle: "",
    });
  }, []);

  if (loading) {
    return (
      <View className={"flex-1 bg-white items-center justify-center"}>
        <ActivityIndicator animating={loading} color={MD2Colors.blue500} />
      </View>
    );
  } else {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className={"flex-1 bg-white px-3"}>
          <ScrollView>
            {/*  Rating box */}

            {user.id !== shop.owner_id && !didUserReview && (
              <>
                <Rating shopId={shop.id} setReviews={setReviews} />
                <Divider className={"mt-5 bg-gray-400"} />
              </>
            )}

            {/*  Average Rating */}
            <View className={"mt-3"}>
              <View className={"flex-row items-center justify-between"}>
                <View>
                  <Text className={"text-2xl font-semibold"}>{shop.name}</Text>
                  <View className={"flex-row items-center mt-2"}>
                    {reviews.length > 0 ? (
                      <>
                        <Text className={"text-xl font-semibold mr-1"}>
                          {calculateAverageRating().toFixed(1)}
                        </Text>
                        <StarIcon size={28} color={MD2Colors.yellow600} />
                      </>
                    ) : (
                      <Text className={"text-lg text-gray-400"}>No rating</Text>
                    )}
                  </View>
                </View>

                <View className={"rounded rounded-lg p-2"}>
                  <Image
                    source={{ uri: shop.logo }}
                    className={"h-24 w-24 rounded rounded-lg"}
                    resizeMode={"contain"}
                  />
                </View>
              </View>
            </View>

            <Divider className={"mt-3 mb-5 bg-gray-400"} />

            {/*  Reviews */}

            {reviews.map((rev) => (
              <View key={rev.id}>
                <ReviewRow item={rev} />
                <Divider className={"my-4 bg-gray-400"} />
              </View>
            ))}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

export default Reviews;
