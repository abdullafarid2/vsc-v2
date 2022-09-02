import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeftIcon, PlusIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import AddressCard from "../components/AddressCard";
import { useTailwind } from "tailwindcss-react-native";

const UserAddressesScreen = () => {
  const tw = useTailwind();
  const { user, getUser } = useAuth();
  const router = useRoute();

  const navigation = useNavigation();

  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const willFocusSubscription = navigation.addListener("focus", () => {
      // tempUser === undefined
      //   ? setAddresses(user.address)
      //   : setAddresses(tempUser.address);
      setAddresses(user.address);
    });

    return willFocusSubscription;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <SafeAreaView style={tw("flex-1 bg-blue-500")} edges={["top"]}>
      <View className="flex flex-row px-3 py-3 w-full bg-blue-500">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon style={tw("text-white")} />
        </TouchableOpacity>
        <View className="flex-1 items-end">
          <TouchableOpacity
            onPress={() => navigation.navigate("CreateAddress")}
          >
            <PlusIcon size={28} style={tw("text-white")} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 bg-white px-3">
        <Text className="text-xl font-bold mt-5">My Addresses</Text>

        <View className="flex-1 mt-5">
          {addresses && addresses.length > 0 ? (
            <ScrollView>
              {addresses.map((address, i) => (
                <AddressCard
                  key={i}
                  id={i}
                  name={address.name}
                  area={address.area}
                  road={address.road}
                  block={address.block}
                  building={address.building}
                  flat={address.flat}
                />
              ))}
            </ScrollView>
          ) : (
            <Text className="text-lg">You don't have any addresses</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserAddressesScreen;
