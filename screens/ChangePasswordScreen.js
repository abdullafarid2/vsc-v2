import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { verifyPassword, verifyConfirmPassword } from "../utils/formValidation";
import Toast from "react-native-toast-message";
import { useTailwind } from "tailwindcss-react-native";

const ChangePasswordScreen = () => {
  const tw = useTailwind();
  const { url, logout, isAuthenticated } = useAuth();

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [checkPassword, setCheckPassword] = useState();
  const [checkConfirmPassword, setCheckConfirmPassword] = useState();

  const valid = checkPassword && checkConfirmPassword && password !== "";

  const changePassword = async () => {
    try {
      const res = await fetch(url + "/changePassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          newPassword,
        }),
      });

      const data = await res.json();

      console.log(data);

      if (data === true) {
        isAuthenticated();
        Toast.show({
          type: "success",
          text1: "Password changed",
          text2: "You have successfully changed your password",
          topOffset: 50,
        });
      } else if (data === "Wrong Password") {
        Toast.show({
          type: "error",
          text1: "Invalid password",
          text2: "Please check your current password and try again",
          topOffset: 50,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View className="flex-1 bg-white px-3">
      <Text className="text-xl font-bold text-black mt-4">Change Password</Text>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className="flex-1 mt-4">
          <View>
            <Text className="text-lg">Current Password</Text>
            <View className="flex flex-row mt-1">
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                className="flex-1 text-lg border-b border-gray-400"
                textContentType="password"
                secureTextEntry
              />
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-lg">New Password</Text>
            <Text
              style={tw(
                `text-xs text-red-500 mt-2 ${
                  (checkPassword || newPassword === "") && "hidden"
                }`
              )}
            >
              Password must contain at least 8 characters, including 1 upper
              case letter, 1 lower case letter, and 1 digit
            </Text>
            <View className="flex flex-row mt-1">
              <TextInput
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setCheckPassword(verifyPassword(text));
                  setCheckConfirmPassword(
                    verifyConfirmPassword(text, confirmPassword)
                  );
                }}
                className="flex-1 text-lg border-b border-gray-400"
                textContentType="password"
                secureTextEntry
              />
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-lg">Confirm New Password</Text>
            <Text
              style={tw(
                `text-xs text-red-500 mt-2 ${
                  (checkConfirmPassword || confirmPassword === "") && "hidden"
                }`
              )}
            >
              Passwords don't match
            </Text>
            <View className="flex flex-row mt-1">
              <TextInput
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setCheckConfirmPassword(
                    verifyConfirmPassword(newPassword, text)
                  );
                }}
                className="flex-1 text-lg border-b border-gray-400"
                textContentType="password"
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={tw(
              `mt-8 py-2 bg-blue-500 rounded-lg ${!valid && "bg-gray-400"}`
            )}
            disabled={!valid}
            onPress={changePassword}
          >
            <Text className="text-white font-semibold text-center text-lg">
              Update Password
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ChangePasswordScreen;
