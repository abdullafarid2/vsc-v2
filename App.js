import { TailwindProvider } from "tailwindcss-react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/useAuth";
import { ShopProvider } from "./hooks/useShops";
import StackNavigator from "./StackNavigator";
import Toast from "react-native-toast-message";
import { LogBox } from "react-native";
import { CartProvider } from "./hooks/useCart";
import { useState } from "react";
import { NotificationProvider } from "./hooks/useNotifications";
LogBox.ignoreLogs(["AsyncStorage", "Cannot update a component"]);

export default function App() {
  return (
    <TailwindProvider>
      <PaperProvider>
        <NavigationContainer>
          <AuthProvider>
            <ShopProvider>
              <NotificationProvider>
                <CartProvider>
                  <StackNavigator />
                  <Toast />
                </CartProvider>
              </NotificationProvider>
            </ShopProvider>
          </AuthProvider>
        </NavigationContainer>
      </PaperProvider>
    </TailwindProvider>
  );
}
