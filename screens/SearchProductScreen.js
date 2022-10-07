import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";
import { MagnifyingGlassIcon, PlusIcon } from "react-native-heroicons/outline";
import ProductRow from "../components/ProductRow";
import useAuth from "../hooks/useAuth";

const SearchProduct = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const tw = useTailwind();
  const { user } = useAuth();
  const { products, ...shopDetails } = route.params;

  const [search, setSearch] = useState("");
  const [results, setResults] = useState(products);

  const filterSearch = () => {
    search === ""
      ? setResults(products)
      : setResults(
          products.filter(
            (product) =>
              product.name.toLowerCase().includes(search.toLowerCase()) &&
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

        <View className="flex flex-row items-center my-4 border-b border-gray-200 pb-2">
          <View className="flex-1">
            <Text className="text-gray-500 font-semibold mb-4">
              Results: {results.length}
            </Text>
          </View>

          {shopDetails.owner_id === user.id && (
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("CreateProduct", {
                    ...shopDetails,
                  })
                }
                className="flex flex-row items-center bg-blue-500 rounded rounded-lg px-3 py-2"
              >
                <PlusIcon size={20} style={tw("text-white mr-2")} />
                <Text className="text-white font-semibold">New product</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {results.length > 0 && (
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <ProductRow product={item} owner={shopDetails.owner_id} />
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchProduct;
