import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/useAuth";
import { ShopProvider } from "./hooks/useShops";
import StackNavigator from "./StackNavigator";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <TailwindProvider>
      <NavigationContainer>
        <AuthProvider>
          <ShopProvider>
            <StackNavigator />
            <Toast />
          </ShopProvider>
        </AuthProvider>
      </NavigationContainer>
    </TailwindProvider>
  );
}
