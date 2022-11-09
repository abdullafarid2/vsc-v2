import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import useAuth from "../hooks/useAuth";
import ChatBubble from "../components/ChatBubble";
import { useTailwind } from "tailwindcss-react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { PaperAirplaneIcon } from "react-native-heroicons/solid";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const tw = useTailwind();

  const { user } = useAuth();

  const { chatId, user: customer } = route.params;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: customer.first_name + " " + customer.last_name,
    });
  });

  const sendMessage = async () => {
    await addDoc(collection(db, "chats", chatId, "messages"), {
      timestamp: serverTimestamp(),
      message: input,
      senderId: user.id,
      receiverId: chatId.split("+")[1],
      read: false,
      shopId: chatId.split("+")[2],
    });

    setInput("");
  };

  useLayoutEffect(() => {
    const unsubscribe = async () => {
      await getDocs(
        query(collection(db, "chats", chatId, "messages"), orderBy("timestamp"))
      ).then((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
      );
    };
    unsubscribe();
  }, [messages]);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "chats", chatId, "messages"),
      where("read", "==", false),
      where("senderId", "==", chatId.split("+")[0])
    );
    return onSnapshot(messagesQuery, (snapshot) => {
      snapshot.forEach(async (m) => {
        await updateDoc(doc(db, "chats", chatId, "messages", m.id), {
          read: true,
        });
      });
    });
  }, []);

  const [inputHeight, setInputHeight] = useState(15);

  const height = useHeaderHeight();

  const scrollViewRef = useRef(null);
  function scrollViewSizeChanged(height) {
    // y since we want to scroll vertically, use x and the width-value if you want to scroll horizontally
    scrollViewRef.current?.scrollTo({ y: height, animated: true });
  }

  return (
    <View className="flex-1">
      <StatusBar />

      <View className="flex-1 px-3">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={height}
        >
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
            contentContainerStyle={tw("my-3")}
          >
            {messages.map((message, i) =>
              message.senderId === user.id ? (
                <ChatBubble
                  message={message.message}
                  me={true}
                  name={customer.first_name + " " + customer.last_name}
                  timestamp={message?.timestamp}
                  key={i}
                />
              ) : (
                <ChatBubble
                  message={message.message}
                  me={false}
                  name={customer.first_name + " " + customer.last_name}
                  timestamp={message?.timestamp}
                  key={i}
                />
              )
            )}

            <View className="h-4"></View>
          </ScrollView>

          <View className="flex flex-row items-center bg-white border border-gray-400 rounded rounded-lg px-3 mb-1">
            <TextInput
              value={input}
              onChangeText={(text) => setInput(text)}
              className={`flex-1 h-[${inputHeight}] bg-white text-lg rounded rounded-lg py-3 max-h-24`}
              placeholder="Enter text here..."
              multiline={true}
              onContentSizeChange={(event) => {
                setInputHeight(event.nativeEvent.contentSize.height);
              }}
            />
            <TouchableOpacity onPress={sendMessage}>
              <PaperAirplaneIcon
                size={24}
                style={tw(
                  `${input.length === 0 ? "text-gray-400" : "text-blue-500"}`
                )}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;
