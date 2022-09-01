import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import ShopRow from "../components/ShopRow";
import useShops from "../hooks/useShops";
import { useTailwind } from "tailwindcss-react-native";

const SearchScreen = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const { url } = useAuth();
  const { shops } = useShops();

  const tw = useTailwind();
  const navigation = useNavigation();

  const filterSearch = () => {
    setResults(
      shops.filter(
        (shop) =>
          shop.name.toLowerCase().includes(search.toLowerCase()) &&
          search !== ""
      )
    );
  };

  useEffect(() => {
    filterSearch();
  }, [search]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: tw("bg-blue-500"),
      headerTintColor: "#FFFFFF",
      headerTitle: "",
    });
  });

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 px-3 bg-white">
        <View className="flex flex-row items-center justify-center mt-4 border border-[#b8b8b8] rounded-lg px-2">
          <MagnifyingGlassIcon size={26} style={tw("text-[#838383]")} />
          <View className="flex-1 ml-4 pb-1">
            <TextInput
              value={search}
              onChangeText={(text) => setSearch(text)}
              placeholder="Search"
              placeholderTextColor={"#b8b8b8"}
              className="text-lg h-9"
            />
          </View>
        </View>

        <View className="flex-1 mt-5">
          {results.length !== 0 ? (
            <>
              <Text className="text-gray-500 font-semibold mb-4">
                Results: {results.length}
              </Text>
              <FlatList
                data={results}
                renderItem={({ item }) => <ShopRow shopDetails={item} />}
                keyExtractor={(item) => item.id}
              />
            </>
          ) : (
            <View className="flex justify-center items-center">
              <Text className="font-semibold text-lg">
                {search !== "" && "No shops found"}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchScreen;
