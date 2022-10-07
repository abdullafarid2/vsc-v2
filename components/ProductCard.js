import React, { useEffect, useState } from "react";
import { Card, Paragraph, Title } from "react-native-paper";
import { useTailwind } from "tailwindcss-react-native";
import { View } from "react-native";

const ProductCard = ({ product, index }) => {
  const tw = useTailwind();

  const [fixedPrice, setFixedPrice] = useState(true);

  useEffect(() => {
    if (product.sizes.length > 1) {
      const basePrice = product.sizes[0].price;
      product.sizes.map((size) => {
        if (size.price !== basePrice) setFixedPrice(false);
      });
    }
  }, []);

  return (
    <View
      className={`w-1/2 ${index % 2 == 0 && "-ml-2"} ${
        index % 2 == 1 && "ml-2"
      }`}
    >
      <Card style={tw(`mb-4`)}>
        <Card.Cover
          source={{
            uri: product.photo,
          }}
        />
        <View className="border-b border-gray-300"></View>
        <Card.Content>
          <Title style={tw("text-lg")}>{product.name}</Title>
          {fixedPrice ? (
            <Paragraph>
              {(Math.round(product.sizes[0].price * 1000) / 1000).toFixed(3)} BD
            </Paragraph>
          ) : (
            <Paragraph>Price on selection</Paragraph>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

export default ProductCard;
