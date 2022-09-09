import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AdjustmentsVerticalIcon } from "react-native-heroicons/outline";
import ProductCard from "./ProductCard";
import { useTailwind } from "tailwindcss-react-native";

const ProductsList = () => {
  const tw = useTailwind();
  const arr = [
    {
      id: 1,
      title: "Shirt",
      price: 2.0,
      imageUrl:
        "https://m.media-amazon.com/images/I/61M9K0JF8bL._AC_SX569._SX._UX._SY._UY_.jpg",
    },
    {
      id: 2,
      title: "Jacket",
      price: 5.0,
      imageUrl:
        "https://www.helikon-tex.com/media/catalog/product/cache/4/image/500x/17f82f742ffe127f42dca9de82fb58b1/b/l/bl-caf-fl-02.jpeg",
    },
    {
      id: 3,
      title: "Pants",
      price: 3.0,
      imageUrl:
        "https://www.helikon-tex.com/media/catalog/product/cache/4/image/9df78eab33525d08d6e5fb8d27136e95/s/p/sp-pgm-dc-11.jpg",
    },
    {
      id: 4,
      title: "Shoes",
      price: 8.0,
      imageUrl:
        "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/47112d0a-dc23-4b74-876c-b638fecf0af2/air-jordan-1-retro-high-og-shoes-a7Zzxm.png",
    },
  ];

  return (
    <View className="mt-3">
      <View className="flex flex-row">
        <View className="flex-1">
          <Text className="text-xl font-semibold">All Items</Text>
        </View>

        <TouchableOpacity className="flex flex-row items-center">
          <AdjustmentsVerticalIcon size={25} style={tw("text-black")} />
          <Text className="ml-1 text-lg">Filter</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-gray-500 font-semibold mt-1 mb-5">20 products</Text>

      <View className="justify-center items-center">
        {arr.map(({ id, title, price, imageUrl }, i, array) => {
          if (i > arr.length / 2 - 1) return;
          return (
            <View className="flex flex-row">
              <ProductCard
                key={array[i * 2].id}
                title={array[i * 2].title}
                price={array[i * 2].price}
                imageUrl={array[i * 2].imageUrl}
                index={i * 2}
              />
              {array[i * 2 + 1] && (
                <ProductCard
                  key={array[i * 2 + 1].id}
                  title={array[i * 2 + 1].title}
                  price={array[i * 2 + 1].price}
                  imageUrl={array[i * 2 + 1].imageUrl}
                  index={i * 2 + 1}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ProductsList;
