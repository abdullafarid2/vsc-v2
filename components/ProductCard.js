import React, { useEffect, useState } from "react";
import { Card, MD2Colors, Paragraph, Title } from "react-native-paper";
import { useTailwind } from "tailwindcss-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useOffers from "../hooks/useOffers";
import Icon from "react-native-vector-icons/FontAwesome5";

const ProductCard = ({ product, index }) => {
  const tw = useTailwind();
  const navigation = useNavigation();

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
      onPress={() =>
        navigation.navigate("Product", {
          product,
          fixedPrice,
          offer,
        })
      }
      activeOpacity={0.7}
      className={`w-1/2 ${index % 2 == 0 && "-ml-2"} ${
        index % 2 == 1 && "ml-2"
      }`}
    >
      {offer && (
        <View
          className={
            "absolute z-40 top-2 left-1 bg-white rounded-lg p-1 border-2 border-gray-200"
          }
        >
          <Icon name={"percent"} size={18} color={MD2Colors.red500} />
        </View>
      )}

      <Card style={tw(`mb-4`)}>
        <Card.Cover
          source={{
            uri: product.photo,
          }}
        />
        <View className="border-b border-gray-300"></View>
        <Card.Content>
          <Title style={tw("text-lg")}>{product.name}</Title>
          <View>
            {offer ? (
              <>
                {fixedPrice ? (
                  <View className={"flex-row justify-between items-center"}>
                    <Paragraph className={"line-through"}>
                      {(
                        Math.round(product.sizes[0].price * 1000) / 1000
                      ).toFixed(3)}{" "}
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
                  </View>
                ) : (
                  <View>
                    <Paragraph>Price on selection</Paragraph>
                  </View>
                )}
              </>
            ) : (
              <>
                {fixedPrice ? (
                  <Paragraph>
                    {(Math.round(product.sizes[0].price * 1000) / 1000).toFixed(
                      3
                    )}{" "}
                    BD
                  </Paragraph>
                ) : (
                  <Paragraph>Price on selection</Paragraph>
                )}
              </>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export default ProductCard;
