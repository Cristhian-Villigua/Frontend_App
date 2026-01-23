import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppProvider, useAppContext } from "./src/context/AppContext";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from 'expo-navigation-bar';

// Auth
import LoginScreen from "./src/screens/mobile/auth/LoginScreen";
import RegisterScreen from "./src/screens/mobile/auth/RegisterScreen";

// Cliente
import CategoriaScreen from "./src/screens/customer_guest/CategoriaScreen";
import DetalleScreen from "./src/screens/customer_guest/DetalleScreen";

// General
import ProfileScreen from "./src/screens/general/ProfileScreen";
import EditProfileScreen from "./src/screens/general/EditProfileScreen";
import MeseroTabs from "./src/navigation/MeseroTabs";
import CocineroTabs from "./src/navigation/CocineroTabs";
import AdminTabs from "./src/navigation/AdminTabs";
import ClienteTabs from "./src/navigation/ClienteTabs";
import { useEffect } from "react";

const Stack = createNativeStackNavigator();

function MainApp() {
  const {
    paperTheme,
    isDarkTheme,
    user,
    userType,
    userRole,
    loadingAuth
  } = useAppContext();

  useEffect(() => {
    const updateSystemBars = async () => {
      if (!user) {
        // 🔄 RESET cuando NO está logueado
        await NavigationBar.setButtonStyleAsync("dark");
        return;
      }

      // 👤 USUARIO LOGUEADO
      await NavigationBar.setButtonStyleAsync(
        isDarkTheme ? "light" : "light"
      );
    };

    updateSystemBars();
  }, [user, isDarkTheme]);


  if (loadingAuth) return null;

  const isCliente = userType === "cliente";
  const isStaff = userType === "usuario";
  const role = userRole; // administrador | cocinero | mesero

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={paperTheme}>
        {user && (
          <StatusBar
            style={isDarkTheme ? "light" : "light"}
            translucent
            backgroundColor="transparent"
          />
        )}
        <StatusBar
            style={isDarkTheme ? "dark" : "dark"}
            translucent
            backgroundColor="transparent"
        />

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* NO LOGUEADO */}
          {!user && (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}

          {/* CLIENTE */}
          {user && isCliente && (
            <>
              <Stack.Screen name="ClienteTabs" component={ClienteTabs} />
              <Stack.Screen name="Categoria" component={CategoriaScreen} />
              <Stack.Screen name="Detalle" component={DetalleScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            </>
          )}

          {/* ADMINISTRADOR */}
          {user && isStaff && role === "administrador" && (
            <>
              <Stack.Screen name="AdminTabs" component={AdminTabs} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            </>
          )}

          {/* COCINERO */}
          {user && isStaff && role === "cocinero" && (
            <>
              <Stack.Screen name="CocineroTabs" component={CocineroTabs} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            </>
          )}

          {/* MESERO */}
          {user && isStaff && role === "mesero" && (
            <>
              <Stack.Screen name="MeseroTabs" component={MeseroTabs} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
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
