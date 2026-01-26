import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import AccountScreen from "../screens/general/AccountScreen";
import { useAppContext } from "../context/AppContext";

const Tab = createBottomTabNavigator();

import KitchenOrdersScreen from "../screens/mobile/cocinero/KitchenOrdersScreen";
import KitchenHistoryScreen from "../screens/mobile/cocinero/KitchenHistoryScreen";

export default function CocineroTabs() {
  const { isDarkTheme } = useAppContext();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: "#fff",
        tabBarActiveTintColor: isDarkTheme ? "#220C01" : "#fff",
        tabBarActiveBackgroundColor: "#b71c1c",
        tabBarStyle: {
          backgroundColor: isDarkTheme ? "#d32f2f" : "#d32f2f",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
          fontWeight: "bold"
        },
      }}
    >
      <Tab.Screen
        name="Pedidos"
        component={KitchenOrdersScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="clipboard-list" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Historial"
        component={KitchenHistoryScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="history" size={20} color={color} />
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
