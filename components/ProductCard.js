import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Card, Paragraph, Title } from "react-native-paper";
import { useTailwind } from "tailwindcss-react-native";

const ProductCard = () => {
  const tw = useTailwind();
  return (
    <Card style={tw("w-1/2")}>
      <Card.Cover
        source={{
          uri: "https://m.media-amazon.com/images/I/61M9K0JF8bL._AC_SX569._SX._UX._SY._UY_.jpg",
        }}
      />
      <Card.Content>
        <Title>Shirt</Title>
        <Paragraph>2.00 BD</Paragraph>
      </Card.Content>
    </Card>
  );
};

export default ProductCard;
