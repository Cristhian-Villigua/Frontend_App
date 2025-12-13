import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function ProfileScreen({ navigation }) {
    const goToLogin = () => navigation.replace("Login");
    return(
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Hola a ProfileScreen</Text>
            <Button
                mode="contained"
                onPress={goToLogin}
                style={{ marginTop: 20 }}
            >
                Cerrar sesión
            </Button>
        </View>
    )
}