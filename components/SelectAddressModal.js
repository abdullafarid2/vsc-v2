import React from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CheckIcon } from "react-native-heroicons/outline";
import { useTailwind } from "tailwindcss-react-native";
import isEqual from "lodash.isequal";

const SelectAddressModal = ({
  selected,
  data,
  setSelect,
  modalVisible,
  setModalVisible,
}) => {
  const tw = useTailwind();
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 bg-white px-3">
          <Text className="text-black font-bold text-xl mt-4">
            Select Address
          </Text>

          <FlatList
            data={data}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex flex-row items-center border-b border-gray-200 py-2"
                onPress={() => setSelect(item)}
              >
                <View className="">
                  <Text className="text-lg">{item.name}</Text>

                  <Text>
                    Road {item.road}, Block {item.block},{" "}
                    {item.flat
                      ? "Bldg " + item.building + ", Flat " + item.flat
                      : "House No. " + item.building}
                  </Text>
                </View>
                {isEqual(selected, item) && (
                  <View className="flex-1 flex-row justify-end">
                    <CheckIcon style={tw("text-blue-500")} />
                  </View>
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            className="mt-4"
          />

          <TouchableOpacity
            className="bg-blue-500 items-center justify-center p-3 rounded-lg my-6"
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text className="text-white font-semibold text-lg">Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default SelectAddressModal;
