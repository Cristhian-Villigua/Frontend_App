import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import AccountScreen from "../screens/general/AccountScreen";
import { useAppContext } from "../context/AppContext";

const Tab = createBottomTabNavigator();

import KitchenOrdersScreen from "../screens/cocinero/KitchenOrdersScreen";
import KitchenHistoryScreen from "../screens/cocinero/KitchenHistoryScreen";

export default function CocineroTabs() {
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
