import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import CustomerScreen from "../screens/admin/CustomerScreen";
import ProductosScreen from "../screens/admin/ProductosScreen";
import UsuariosScreen from "../screens/admin/UsuariosScreen";
import AccountScreen from "../screens/general/AccountScreen";
import { useAppContext } from "../context/AppContext";

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  const { isDarkTheme } = useAppContext();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: "#fff",
        tabBarActiveTintColor: isDarkTheme ? "#220C01" : "#d32f2f",
        tabBarStyle: {
          backgroundColor: isDarkTheme ? "#d32f2f" : "#220C01",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="Clientes"
        component={CustomerScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="users" size={20} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Productos"
        component={ProductosScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="box-open" size={20} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Usuarios"
        component={UsuariosScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="users" size={20} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="circle-user" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
