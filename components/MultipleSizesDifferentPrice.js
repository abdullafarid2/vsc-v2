import React, { useEffect, useCallback } from "react";
import { TextInput as RNTextInput, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

const MultipleSizesDifferentPrice = ({ sizes, setSizes, numberOfSizes }) => {
  const generateCells = () => {
    for (let i = 0; i < numberOfSizes; i++) {
      setSizes((sizes) => [...sizes, { size: "", quantity: 0, price: 0 }]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setSizes([]);
      generateCells();
    }, [])
  );
  return (
    <View className="flex-1">
      {sizes.map((s, i, arr) => (
        <View key={i} className="flex-1 my-2">
          <View className="flex-1 flex-row">
            <TextInput
              mode="flat"
              label="Size"
              onChangeText={(text) => {
                sizes[i].size = text;
              }}
              underlineColor="#0099F9"
              activeUnderlineColor="#0099F9"
              className="bg-white mb-4 w-1/3"
            />
            <TextInput
              label="Quantity"
              underlineColor="#0099F9"
              activeUnderlineColor="#0099F9"
              className="bg-white mb-4 w-1/3 mx-4"
              onChangeText={(text) => {
                sizes[i].quantity = text;
              }}
              render={(props) => (
                <RNTextInput {...props} keyboardType="numeric" />
              )}
            />

            <TextInput
              label="Price"
              underlineColor="#0099F9"
              activeUnderlineColor="#0099F9"
              className="bg-white mb-4 w-1/3"
              onChangeText={(text) => {
                sizes[i].price = text;
              }}
              render={(props) => (
                <RNTextInput {...props} keyboardType="numeric" />
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
