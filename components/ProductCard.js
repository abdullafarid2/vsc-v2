import React from "react";
import { Card, Paragraph, Title } from "react-native-paper";
import { useTailwind } from "tailwindcss-react-native";
import { View } from "react-native";

const ProductCard = ({ name, price, photos, index }) => {
  const tw = useTailwind();

  return (
    <Card
      style={tw(
        `w-1/2 mb-4 ${index % 2 == 1 && "ml-3"} ${index % 2 == 0 && "-ml-2"}`
      )}
    >
      <Card.Cover
        source={{
          uri: photos[0],
        }}
      />
      <View className="border-b border-gray-300"></View>
      <Card.Content>
        <Title>{name}</Title>
        <Paragraph>{(Math.round(price * 1000) / 1000).toFixed(3)} BD</Paragraph>
      </Card.Content>
    </Card>
  );
};

export default ProductCard;
