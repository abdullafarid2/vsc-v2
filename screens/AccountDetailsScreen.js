import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import {
  verifyName,
  verifyEmail,
  verifyPhoneNumber,
  verifyCpr,
} from "../utils/formValidation";
import {
  ArrowLeftIcon,
  CheckIcon,
  PencilIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useTailwind } from "tailwindcss-react-native";

const AccountDetailsScreen = () => {
  const { user, url, isAuthenticated } = useAuth();
  const tw = useTailwind();
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState(user?.first_name);
  const [lastName, setLastName] = useState(user?.last_name);
  const [email, setEmail] = useState(user?.email);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number);
  const [cpr, setCpr] = useState(user?.cpr);

  const [checkFirstName, setCheckFirstName] = useState(true);
  const [checkLastName, setCheckLastName] = useState(true);
  const [checkEmail, setCheckEmail] = useState(true);
  const [checkPhoneNumber, setCheckPhoneNumber] = useState(true);
  const [checkCpr, setCheckCpr] = useState();

  const [editing, setEditing] = useState(false);

  const valid =
    checkFirstName && checkLastName && checkEmail && checkPhoneNumber;

  const changed =
    firstName !== user.first_name ||
    lastName !== user.last_name ||
    email !== user.email ||
    phoneNumber.toString() !== user.phone_number.toString();

  const editUserInfo = async () => {
    try {
      const res = await fetch(url + "/editUserInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
        }),
      });

      const success = await res.json();

      if (success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Your account details have been updated successfully!",
          visibilityTime: 3000,
          topOffset: 50,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Something went wrong...",
          visibilityTime: 3000,
          topOffset: 50,
        });
      }

      isAuthenticated();
      setEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  const cancel = () => {
    setFirstName(user?.first_name);
    setLastName(user?.last_name);
    setEmail(user?.email);
    setPhoneNumber(user?.phone_number);

    setEditing(false);
  };

  useEffect(() => {
    isAuthenticated();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView
      style={tw(`flex-1 bg-blue-500 ${editing && "bg-white"}`)}
      edges={["top"]}
    >
      <View
        style={tw(
          `flex flex-row px-3 py-3 w-full bg-blue-500 ${editing && "bg-white"}`
        )}
      >
        {editing ? (
          <>
            <View>
              <TouchableOpacity
                className="rounded-full bg-gray-200 p-2 items-center justify-center"
                onPress={cancel}
              >
                <XMarkIcon style={tw("text-red-500")} />
              </TouchableOpacity>
            </View>
            <View className="flex-1 items-end">
              <TouchableOpacity
                style={tw(
                  `flex rounded-full bg-gray-200 p-2 items-center justify-center ${
                    (!valid || !changed) && "hidden"
                  }`
                )}
                onPress={() => setEditing(false)}
                disabled={!valid || !changed}
              >
                <CheckIcon style={tw("text-green-500")} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeftIcon style={tw("text-white")} />
            </TouchableOpacity>

            <View className="flex-1 items-end">
              <TouchableOpacity onPress={() => setEditing(true)}>
                <PencilIcon size={28} style={tw("text-white")} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className="flex-1 bg-white px-3">
          <Text className="mt-5 font-bold text-xl">Account Details</Text>

          <View className="flex-1 mt-4">
            <View
              style={tw(
                `flex flex-row items-center border border-[#a3a0a8] rounded-lg py-2 px-3 ${
                  editing &&
                  firstName !== user.first_name &&
                  checkFirstName &&
                  "border-green-500"
                } ${
                  editing &&
                  firstName !== user.first_name &&
                  !checkFirstName &&
                  "border-red-500"
                }`
              )}
            >
              <Text className="text-lg">First Name: </Text>
              <TextInput
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  setCheckFirstName(verifyName(text));
                }}
                placeholder="First Name"
                className="flex-1 flex-wrap ml-3 text-lg h-9 font-semibold text-gray-700"
                editable={editing}
              />
              {firstName !== user.first_name && checkFirstName && (
                <CheckIcon style={tw("text-green-500")} />
              )}

              {firstName !== user.first_name && !checkFirstName && (
                <XIcon style={tw("text-red-500")} />
              )}
            </View>

            <View
              style={tw(
                `flex flex-row items-center mt-3 border border-[#a3a0a8] rounded-lg py-2 px-3  ${
                  editing &&
                  lastName !== user.last_name &&
                  checkLastName &&
                  "border-green-600"
                } ${
                  editing &&
                  lastName !== user.last_name &&
                  !checkLastName &&
                  "border-red-600"
                }`
              )}
            >
              <Text className="text-lg">Last Name: </Text>
              <TextInput
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  setCheckLastName(verifyName(text));
                }}
                placeholder="Last Name"
                className="flex-1 flex-wrap ml-3 text-lg h-9 font-semibold text-gray-700"
                editable={editing}
              />
              {lastName !== user.last_name && checkLastName && (
                <CheckIcon style={tw("text-green-500")} />
              )}

              {lastName !== user.last_name && !checkLastName && (
                <XIcon style={tw("text-red-500")} />
              )}
            </View>

            <View
              style={tw(
                `flex flex-row items-center mt-3 border border-[#a3a0a8] rounded-lg py-2 px-3  ${
                  editing &&
                  email !== user.email &&
                  checkEmail &&
                  "border-green-600"
                } ${
                  editing &&
                  email !== user.email &&
                  !checkEmail &&
                  "border-red-600"
                }`
              )}
            >
              <Text className="text-lg">Email: </Text>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setCheckEmail(verifyEmail(text));
                }}
                placeholder="Email"
                className="flex-1 flex-wrap ml-3 text-lg h-9 font-semibold text-gray-700"
                editable={editing}
              />
              {email !== user.email && checkEmail && (
                <CheckIcon style={tw("text-green-500")} />
              )}

              {email !== user.email && !checkEmail && (
                <XIcon style={tw("text-red-500")} />
              )}
            </View>

            <View
              style={tw(
                `flex flex-row items-center mt-3 border border-[#a3a0a8] rounded-lg py-2 px-3  ${
                  editing &&
                  phoneNumber.toString() !== user.phone_number.toString() &&
                  checkPhoneNumber &&
                  "border-green-600"
                } ${
                  editing &&
                  phoneNumber.toString() !== user.phone_number.toString() &&
                  !checkPhoneNumber &&
                  "border-red-600"
                }`
              )}
            >
              <Text className="text-lg">Phone: </Text>
              <TextInput
                value={phoneNumber.toString()}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  setCheckPhoneNumber(verifyPhoneNumber(text));
                }}
                placeholder="Phone"
                className="flex-1 flex-wrap ml-3 text-lg h-9 font-semibold text-gray-700"
                editable={editing}
                textContentType="telephoneNumber"
                keyboardType="numeric"
              />
              {phoneNumber.toString() !== user.phone_number.toString() &&
                checkPhoneNumber && <CheckIcon style={tw("text-green-500")} />}

              {phoneNumber.toString() !== user.phone_number.toString() &&
                !checkPhoneNumber && <XIcon style={tw("text-red-500")} />}
            </View>

            {user?.cpr && (
              <View
                style={`flex flex-row items-center mt-3 border border-[#a3a0a8] rounded-lg py-2 px-3  ${
                  editing && cpr !== user.cpr && checkCpr && "border-green-600"
                } ${
                  editing && cpr !== user.cpr && !checkCpr && "border-red-600"
                }`}
              >
                <Text className="text-lg">CPR: </Text>
                <TextInput
                  value={cpr}
                  onChangeText={(text) => {
                    setCpr(text);
                    setCheckCpr(verifyCpr(text));
                  }}
                  placeholder="CPR"
                  className="flex-1 flex-wrap ml-3 text-lg h-9 font-semibold text-gray-700"
                  editable={false}
                  keyboardType="numeric"
                />
                {cpr !== user.cpr && checkCpr && (
                  <CheckIcon style={tw("text-green-500")} />
                )}

                {cpr !== user.cpr && !checkCpr && (
                  <XIcon style={tw("text-red-500")} />
                )}
              </View>
            )}

            <TouchableOpacity
              style={tw(
                `hidden justify-center items-center bg-blue-500 rounded-lg mt-6 py-3 ${
                  editing && "flex"
                } ${(!valid || !changed) && "bg-gray-300"}`
              )}
              disabled={!valid || !changed}
              onPress={editUserInfo}
            >
              <Text className="text-white font-semibold text-lg">
                Confirm Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AccountDetailsScreen;
