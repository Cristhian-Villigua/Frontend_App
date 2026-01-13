import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppProvider, useAppContext } from "./src/context/AppContext";
import DashboardTabs from "./src/navigation/DashboardTabs";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import RegisterScreenMobile from "./src/screens/mobile/auth/RegisterScreen";
import RegisterScreenWeb from "./src/screens/web/auth/RegisterScreen";
import LoginScreenWeb from "./src/screens/web/auth/LoginScreen";
import LoginScreenMobile from "./src/screens/mobile/auth/LoginScreen";
import CategoriaScreen from "./src/screens/customer_guest/CategoriaScreen";
import DetalleScreen from "./src/screens/customer_guest/DetalleScreen";
import CarritoScreen from "./src/screens/customer_guest/CartScreen";

const Stack = createNativeStackNavigator();

function MainApp() {
  const { paperTheme, isDarkTheme, user, loadingAuth } = useAppContext();
  const RegisterScreen = Platform.OS === 'web' ? RegisterScreenWeb : RegisterScreenMobile;
  const LoginScreen = Platform.OS === 'web' ? LoginScreenWeb : LoginScreenMobile;
  if (loadingAuth) return null;
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={paperTheme}>
        <StatusBar
          style={isDarkTheme ? "light" : "dark"}
          backgroundColor="transparent"
          translucent={true} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
          ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardTabs} />
            <Stack.Screen name="Categoria" component={CategoriaScreen} />
            <Stack.Screen name="Detalle" component={DetalleScreen} />
            <Stack.Screen name="CarritoScreen" component={CarritoScreen} />
          </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
