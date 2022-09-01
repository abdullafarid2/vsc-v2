import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";

const CategoriesSlider = () => {
  const [categories, setCategories] = useState([]);

  const { url } = useAuth();

  const fetchCategories = async () => {
    try {
      const res = await fetch(url + "/categories", {
        method: "GET",
      });

      const data = await res.json();

      if (data) {
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const tw = useTailwind();
  const navigation = useNavigation();

  return (
    <View className="flex pl-3 mt-5">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <View key={category.id} className="justify-center items-center mr-4">
            <TouchableOpacity
              className="h-32 w-32 mb-2 rounded-lg -mb-2"
              onPress={() =>
                navigation.navigate("Category", {
                  category,
                })
              }
            >
              <Image
                source={{
                  uri: category.imageurl,
                }}
                style={{ width: "100%", height: "100%", alignSelf: "center" }}
              />
            </TouchableOpacity>
            <Text className="font-semibold text-lg">{category.name}</Text>
          </View>
        ))}

        <View className="justify-center items-center mr-3">
          <TouchableOpacity className="justify-center items-center">
            <Text className="font-semibold text-lg">View All</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoriesSlider;
