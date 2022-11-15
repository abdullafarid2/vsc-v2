import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { StarIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwindcss-react-native";
import { PencilIcon } from "react-native-heroicons/outline";
import useAuth from "../hooks/useAuth";
import useOffers from "../hooks/useOffers";
import { Paragraph } from "react-native-paper";

const ProductRow = ({ product, owner }) => {
  const navigation = useNavigation();
  const tw = useTailwind();
  const { user } = useAuth();
  const { offers } = useOffers();

  const [fixedPrice, setFixedPrice] = useState(true);
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    const filter = offers.filter((o) => o.pid === product.id);

    if (filter.length === 1) {
      setOffer(filter[0]);
    }

    if (product.sizes.length > 1) {
      const basePrice = product.sizes[0].price;
      product.sizes.map((size) => {
        if (size.price !== basePrice) setFixedPrice(false);
      });
    }
  }, []);

  return (
    <TouchableOpacity
      className="flex flex-row mb-3 mx-3 border border-[#e0dcdc] rounded-lg"
      activeOpacity={1}
      onPress={() => {
        navigation.navigate("Product", {
          product,
          fixedPrice,
          offer,
        });
      }}
    >
      <View className="h-36 w-40 rounded-lg p-3">
        <Image
          source={{ uri: product.photo }}
          style={[{ width: "100%", height: "100%" }, tw("rounded-lg")]}
          resizeMode="contain"
        />
      </View>

      <View className="flex-1 py-3 pl-3 pr-1 rounded-lg">
        <Text className="text-lg font-bold">{product.name}</Text>
        {offer ? (
          <>
            {fixedPrice ? (
              <>
                <Paragraph className={"line-through"}>
                  {(Math.round(product.sizes[0].price * 1000) / 1000).toFixed(
                    3
                  )}{" "}
                  BD
                </Paragraph>

                <Paragraph className={"text-red-500 font-medium"}>
                  {(
                    Math.round(
                      product.sizes[0].price *
                        ((100 - offer.discount_value) / 100) *
                        1000
                    ) / 1000
                  ).toFixed(3)}{" "}
                  BD
                </Paragraph>
              </>
            ) : (
              <Paragraph>Price not fixed</Paragraph>
            )}
          </>
        ) : (
          <>
            {fixedPrice ? (
              <Paragraph>
                {(Math.round(product.sizes[0].price * 1000) / 1000).toFixed(3)}{" "}
                BD
              </Paragraph>
            ) : (
              <Paragraph>Price on selection</Paragraph>
            )}
          </>
        )}
      </View>

      {owner === user.id && (
        <View className="p-3">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditProduct", {
                product,
              })
            }
            className="bg-gray-200 rounded rounded-full p-2"
          >
            <PencilIcon size={25} style={tw("text-black")} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ProductRow;
