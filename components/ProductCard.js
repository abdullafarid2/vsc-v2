import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Card, Paragraph, Title } from "react-native-paper";
import { useTailwind } from "tailwindcss-react-native";

const ProductCard = ({ title, price, imageUrl, index }) => {
  const tw = useTailwind();
  return (
    <Card style={tw(`w-1/2 mb-4 ${index % 2 == 1 && "ml-1"}`)}>
      <Card.Cover
        source={{
          uri: imageUrl,
        }}
      />
      <Card.Content>
        <Title>{title}</Title>
        <Paragraph>{price} BD</Paragraph>
      </Card.Content>
    </Card>
  );
};

export default ProductCard;
