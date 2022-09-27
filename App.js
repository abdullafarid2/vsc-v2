import { TailwindProvider } from "tailwindcss-react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/useAuth";
import { ShopProvider } from "./hooks/useShops";
import StackNavigator from "./StackNavigator";
import Toast from "react-native-toast-message";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["AsyncStorage", "Cannot update a component"]);

export default function App() {
  return (
    <TailwindProvider>
      <PaperProvider>
        <NavigationContainer>
          <AuthProvider>
            <ShopProvider>
              <StackNavigator />
              <Toast />
            </ShopProvider>
          </AuthProvider>
        </NavigationContainer>
      </PaperProvider>
    </TailwindProvider>
  );
}
