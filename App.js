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

const Stack = createNativeStackNavigator();

function MainApp() {
  const { paperTheme, isDarkTheme } = useAppContext();
  const RegisterScreen = Platform.OS === 'web' ? RegisterScreenWeb : RegisterScreenMobile;
  const LoginScreen = Platform.OS === 'web' ? LoginScreenWeb : LoginScreenMobile
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={paperTheme}>
        <StatusBar
          style={isDarkTheme ? "light" : "dark"}
          backgroundColor="transparent"
          translucent={true} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={DashboardTabs} />
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
