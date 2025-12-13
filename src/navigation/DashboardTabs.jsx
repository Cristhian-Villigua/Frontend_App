import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuScreen from "../screens/customer_guest/MenuScreen";
import CartScreen from "../screens/customer_guest/CartScreen";
import SearchScreen from "../screens/customer_guest/SearchScreen";
import HistoryScreen from "../screens/customer_guest/HistoryScreen";
import ProfileScreen from "../screens/customer_guest/ProfileScreen";
const Tab = createBottomTabNavigator();
export default function DashboardTabs() {
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#144985",
                tabBarInactiveTintColor: "#777",
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 4,
                },

                tabBarStyle: {
                    height: 50 + insets.bottom,
                    paddingBottom: 6,
                    elevation: 0
                },

                tabBarIcon: ({ color }) => {
                    let iconName = "home";
                    let IconComponent = FontAwesome;

                    switch (route.name) {
                        case "Menu":
                            iconName = "home";
                            IconComponent = FontAwesome;
                            break;
                        case "Carrito":
                            iconName = "shopping-cart";
                            IconComponent = FontAwesome;
                            break;
                        case "Buscar":
                            iconName = "search";
                            IconComponent = FontAwesome;
                            break;
                        case "Historial":
                            iconName = "clipboard-list";
                            IconComponent = FontAwesome5;
                            break;
                        case "Perfil":
                            iconName = "circle-user";
                            IconComponent = FontAwesome6;
                            break;
                    }

                    return (
                        <IconComponent
                            name={iconName}
                            size={20}
                            color={color}
                            style={{ marginTop: 4 }}
                            solid
                        />
                    );
                },
            })}
        >
           <Tab.Screen name="Menu" component={MenuScreen} />
           <Tab.Screen name="Carrito" component={CartScreen} />
           <Tab.Screen name="Buscar" component={SearchScreen} />
           <Tab.Screen name="Historial" component={HistoryScreen} />
           <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}