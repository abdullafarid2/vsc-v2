import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  TouchableOpacity,
  LogBox,
  ImageBackground,
  Platform,
} from "react-native";
import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  AtSymbolIcon,
  LockClosedIcon,
  PhoneIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import {
  verifyName,
  verifyEmail,
  verifyPassword,
  verifyConfirmPassword,
  verifyPhoneNumber,
} from "../utils/formValidation";
import { useTailwind } from "tailwindcss-react-native";

LogBox.ignoreLogs(["Unsupported"]);

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();

  const [checkFirstName, setCheckFirstName] = useState();
  const [checkLastName, setCheckLastName] = useState();
  const [checkEmail, setCheckEmail] = useState();
  const [checkPassword, setCheckPassword] = useState();
  const [checkConfirmPassword, setCheckConfirmPassword] = useState();
  const [checkPhoneNumber, setCheckPhoneNumber] = useState();

  const lastNameInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();
  const confirmPasswordInput = useRef();
  const phoneNumberInput = useRef();

  const valid =
    checkFirstName &&
    checkLastName &&
    checkEmail &&
    checkPassword &&
    checkConfirmPassword &&
    checkPhoneNumber;

  const { register } = useAuth();

  const navigation = useNavigation();
  const tw = useTailwind();

  return (
    <View className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ImageBackground
          source={require("../assets/images/login-bg.png")}
          className="flex-1 justify-center"
          resizeMode="cover"
        >
          <TouchableWithoutFeedback
            onPress={() => Keyboard.dismiss()}
            className=""
          >
            <View className="flex-1 px-5 justify-center">
              <StatusBar style="dark" />

              <View className="flex flex-row justify-center">
                <Text className="text-black font-bold text-3xl">Register</Text>
              </View>

              <View className="flex flex-row items-center border-b border-[#B8B8B8] pb-1 mt-8">
                <UserIcon
                  style={tw(
                    `self-end text-gray-400 ${
                      checkFirstName === true &&
                      firstName !== "" &&
                      "text-green-600"
                    } ${
                      checkFirstName === false &&
                      firstName !== "" &&
                      "text-red-600"
                    }`
                  )}
                />
                <TextInput
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    setCheckFirstName(verifyName(text));
                  }}
                  onFocus={() => {}}
                  placeholder="First Name"
                  className="flex-1 flex-wrap ml-5 text-lg h-9"
                  returnKeyType="next"
                  returnKeyLabel="next"
                  onSubmitEditing={() => lastNameInput.current.focus()}
                />
              </View>

              <View className="flex flex-row items-center border-b border-[#B8B8B8] pb-1 mt-8">
                <UserIcon
                  style={tw(
                    `self-end text-gray-400 ${
                      checkLastName === true &&
                      lastName !== "" &&
                      "text-green-600"
                    } ${
                      checkLastName === false &&
                      lastName !== "" &&
                      "text-red-600"
                    }`
                  )}
                />
                <TextInput
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    setCheckLastName(verifyName(text));
                  }}
                  placeholder="Last Name"
                  className="flex-1 flex-wrap ml-5 text-lg h-9"
                  ref={lastNameInput}
                  returnKeyType="next"
                  returnKeyLabel="next"
                  onSubmitEditing={() => emailInput.current.focus()}
                />
              </View>

              <View className="flex flex-row items-center border-b border-[#B8B8B8] pb-1 mt-8">
                <AtSymbolIcon
                  style={tw(
                    `self-end text-gray-400 ${
                      checkEmail === true && email !== "" && "text-green-600"
                    } ${checkEmail === false && email !== "" && "text-red-600"}`
                  )}
                />
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setCheckEmail(verifyEmail(text));
                  }}
                  placeholder="Email Address"
                  className="flex-1 flex-wrap ml-5 text-lg h-9"
                  ref={emailInput}
                  returnKeyType="next"
                  returnKeyLabel="next"
                  onSubmitEditing={() => passwordInput.current.focus()}
                />
              </View>

              <View className="flex mt-8">
                <Text
                  className={`text-xs text-red-500 ${
                    (checkPassword || password === "") && "hidden"
                  }`}
                >
                  Password must contain at least 8 characters, including 1 upper
                  case letter, 1 lower case letter, and 1 digit
                </Text>

                <View className="flex flex-row items-center border-b border-[#B8B8B8] pb-1">
                  <LockClosedIcon
                    style={tw(
                      `self-end text-gray-400 ${
                        checkPassword === true &&
                        password !== "" &&
                        "text-green-600"
                      } ${
                        checkPassword === false &&
                        password !== "" &&
                        "text-red-600"
                      }`
                    )}
                  />
                  <TextInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setCheckPassword(verifyPassword(text));
                    }}
                    placeholder="Password"
                    textContentType="oneTimeCode"
                    secureTextEntry
                    autoCorrect={false}
                    className="flex-1 flex-wrap ml-5 text-lg h-9"
                    ref={passwordInput}
                    returnKeyType="next"
                    returnKeyLabel="next"
                    onSubmitEditing={() => confirmPasswordInput.current.focus()}
                  />
                </View>
              </View>

              <View className="flex mt-8">
                <Text
                  className={`text-xs text-red-500 ${
                    (checkConfirmPassword || confirmPassword === "") && "hidden"
                  }`}
                >
                  Passwords don't match
                </Text>
                <View className="flex flex-row items-center border-b border-[#B8B8B8] pb-1">
                  <LockClosedIcon
                    style={tw(
                      `self-end text-gray-400 ${
                        checkConfirmPassword === true &&
                        confirmPassword !== "" &&
                        "text-green-600"
                      } ${
                        checkConfirmPassword === false &&
                        confirmPassword !== "" &&
                        "text-red-600"
                      }`
                    )}
                  />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setCheckConfirmPassword(
                        verifyConfirmPassword(password, text)
                      );
                    }}
                    placeholder="Confirm Password"
                    textContentType="oneTimeCode"
                    secureTextEntry
                    autoCorrect={false}
                    className="flex-1 flex-wrap ml-5 text-lg h-9"
                    ref={confirmPasswordInput}
                    returnKeyType="next"
                    returnKeyLabel="next"
                    onSubmitEditing={() => phoneNumberInput.current.focus()}
                  />
                </View>
              </View>

              <View className="flex flex-row items-center border-b border-[#B8B8B8] pb-1 mt-8">
                <PhoneIcon
                  style={tw(
                    `self-end text-gray-400 ${
                      checkPhoneNumber === true &&
                      phoneNumber !== "" &&
                      "text-green-600"
                    } ${
                      checkPhoneNumber === false &&
                      phoneNumber !== "" &&
                      "text-red-600"
                    }`
                  )}
                />
                <TextInput
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    setCheckPhoneNumber(verifyPhoneNumber(text));
                  }}
                  keyboardType="number-pad"
                  textContentType="telephoneNumber"
                  placeholder="Phone Number"
                  className="flex-1 flex-wrap ml-5 text-lg h-9"
                  ref={phoneNumberInput}
                />
              </View>

              <TouchableOpacity
                className={`bg-blue-500 rounded rounded-lg px-5 py-3 mt-12 ${
                  !valid && "bg-gray-400"
                }`}
                onPress={() => {
                  register(firstName, lastName, email, password, phoneNumber);
                }}
                disabled={!valid}
              >
                <Text className="text-white font-bold text-lg text-center">
                  Register
                </Text>
              </TouchableOpacity>
              <View className="flex flex-row mt-4">
                <Text className="text-lg">Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text className="font-semibold text-lg text-blue-500">
                    {" "}
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;
