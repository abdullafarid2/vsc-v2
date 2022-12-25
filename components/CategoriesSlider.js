import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

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
          <View
            key={category.id}
            className="justify-center items-center mr-4 flex-1 flex-wrap"
          >
            <TouchableOpacity
              className={`p-8 rounded-full -mb-2 justify-center items-center`}
              style={{ backgroundColor: "#" + category.color }}
              onPress={() =>
                navigation.navigate("Category", {
                  category,
                })
              }
            >
              {category.name !== "Other" && (
                <Icon name={category.icon} size={40} color={"#000000"} />
              )}

              {category.name === "Other" && (
                <Text className={"text-lg font-medium"}>Other</Text>
              )}
            </TouchableOpacity>

            {category.name !== "Other" && (
              <Text className="font-semibold text-lg mt-2">
                {category.name}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoriesSlider;
