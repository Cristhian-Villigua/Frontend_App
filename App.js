import { PaperProvider } from "react-native-paper";
import LoginScreen from "./src/screens/auth/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppProvider, useAppContext } from "./src/context/AppContext";
import DashboardTabs from "./src/navigation/DashboardTabs";
import { StatusBar } from "expo-status-bar";
import RegisterScreen from "./src/screens/auth/RegisterScreen";

const Stack = createNativeStackNavigator();

function MainApp() {
  const { paperTheme, isDarkTheme } = useAppContext();
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