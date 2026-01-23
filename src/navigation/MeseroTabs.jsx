import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import AccountScreen from "../screens/general/AccountScreen";
import { useAppContext } from "../context/AppContext";

const Tab = createBottomTabNavigator();

export default function MeseroTabs() {
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
