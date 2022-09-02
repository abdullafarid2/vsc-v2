import React, { useState } from "react";
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AtSymbolIcon, LockClosedIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import colors from "tailwindcss/colors";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading } = useAuth();

  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ImageBackground
        source={require("../assets/images/login-bg.png")}
        className="flex-1 justify-center"
        resizeMode="cover"
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View className="flex-1 px-5 justify-center">
            <StatusBar style="dark" />

            <View className="flex">
              <Text className="text-black font-bold text-3xl">Login</Text>
            </View>

            <View className="flex flex-row items-center border-b border-[#B8B8B8] pb-1 mt-8">
              <AtSymbolIcon color={colors.blue["500"]} />
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Email Address"
                autoCapitalize='none'
                className="flex-1 flex-wrap ml-5 text-lg h-9"
                editable={!loading}
              />
            </View>

            <View className="flex flex-row items-center border-b border-[#B8B8B8] pb-1 mt-8">
              <LockClosedIcon color={colors.blue["500"]} />
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder="Password"
                textContentType="password"
                autoCapitalize='none'
                secureTextEntry
                className="flex-1 flex-wrap ml-5 text-lg h-9"
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              className="bg-blue-500 rounded rounded-lg px-5 py-3 mt-12"
              onPress={() => login(email, password)}
            >
              <Text className="text-white font-bold text-lg text-center">
                Login
              </Text>
            </TouchableOpacity>

            <View className="flex flex-row justify-center mt-7">
              <Text className="text-lg">Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text className="font-semibold text-lg text-blue-500">
                  {" "}
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
