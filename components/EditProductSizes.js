import React, { useEffect, useCallback } from "react";
import { Text, TextInput as RNTextInput, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

const MultipleSizesDifferentPrice = ({ sizes, setSizes, numberOfSizes }) => {
  // const generateCells = () => {
  //     for (let i = 0; i < numberOfSizes; i++) {
  //         setSizes((sizes) => [...sizes, { size: "", quantity: 0, price: 0 }]);
  //     }
  // };
  //
  // useFocusEffect(
  //     useCallback(() => {
  //         generateCells();
  //     }, [])
  // );
  return (
    <View className="flex-1">
      {sizes.map((s, i, arr) => (
        <View key={i} className="flex-1 my-2">
          <Text className={"mb-2 text-lg font-medium"}>
            Size: {sizes[i].size}
          </Text>

          <View className={"flex-row items-center mb-2"}>
            <Text className={"mr-3"}>Quantity</Text>
            <TextInput
              underlineColor="#0099F9"
              activeUnderlineColor="#0099F9"
              className="w-1/2 bg-white"
              onChangeText={(text) => {
                sizes[i].quantity = text;
              }}
              render={(props) => (
                <RNTextInput
                  {...props}
                  value={sizes[i].quantity.toString()}
                  keyboardType="numeric"
                />
              )}
            />
          </View>

          <View className={"flex-row items-center"}>
            <Text className={"mr-9"}>Price</Text>
            <TextInput
              underlineColor="#0099F9"
              activeUnderlineColor="#0099F9"
              className="w-1/2 bg-white"
              onChangeText={(text) => {
                sizes[i].price = text;
              }}
              render={(props) => (
                <RNTextInput
                  {...props}
                  value={sizes[i].price.toString()}
                  keyboardType="numeric"
                />
              )}
              right={<TextInput.Affix text="BHD" />}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default MultipleSizesDifferentPrice;
